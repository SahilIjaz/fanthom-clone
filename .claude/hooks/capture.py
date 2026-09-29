#!/usr/bin/env python3
"""8x agent-capture hook for Claude Code.

Wired in .claude/settings.json:
  UserPromptSubmit -> `capture.py prompt`   (stdin: {session_id, transcript_path, prompt, ...})
  Stop             -> `capture.py stop`     (stdin: {session_id, transcript_path, ...})

Writes one file per session to .agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md
in the 8x format: PROMPT entry on submit, RESPONSE entry (final assistant text of
the turn, read from the session transcript) on stop. Entries are append-only;
only the frontmatter counters are rewritten.
"""
import glob
import json
import os
import re
import sys
from datetime import datetime, timezone

AUTHOR = "SahilIjaz"
TOOL = "claude-code"
PROJECT = "fathom-clone"
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOG_DIR = os.path.join(REPO, ".agent-logs")


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + f"{datetime.now(timezone.utc).microsecond // 1000:03d}Z"


def log_path(session_id, ts_iso):
    os.makedirs(LOG_DIR, exist_ok=True)
    found = glob.glob(os.path.join(LOG_DIR, f"*_{session_id}.md"))
    if found:
        return found[0]
    stamp = datetime.strptime(ts_iso[:19], "%Y-%m-%dT%H:%M:%S").strftime("%Y-%m-%d_%H-%M-%S")
    return os.path.join(LOG_DIR, f"{stamp}_{session_id}.md")


def read_file(path):
    if not os.path.exists(path):
        return ""
    with open(path, encoding="utf-8") as f:
        return f.read()


def write_frontmatter(path, session_id, model, first_ts, last_ts, exchanges, body):
    fm = (
        "---\n"
        f"session_id: {session_id}\n"
        f"date: {first_ts[:10]}\n"
        f"author: {AUTHOR}\n"
        f"model: {model}\n"
        f"tool: {TOOL}\n"
        f"project: {PROJECT}\n"
        f"total_exchanges: {exchanges}\n"
        f"first_prompt_time: {first_ts}\n"
        f"last_prompt_time: {last_ts}\n"
        "---\n"
    )
    if not body:
        body = (
            f"\n# Session Log - {first_ts[:10]}\n\n"
            f"Session: `{session_id[:8]}` | Project: `{PROJECT}` | Author: `{AUTHOR}`\n\n---\n"
        )
    with open(path, "w", encoding="utf-8") as f:
        f.write(fm + body)


def parse(path):
    """Return (frontmatter dict, body) of an existing log file."""
    text = read_file(path)
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    fm = {}
    for line in text[4:end].splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip()
    return fm, text[end + 5:]


def append_entry(session_id, kind, num, ts, model, content):
    path = log_path(session_id, ts)
    fm, body = parse(path)
    first_ts = fm.get("first_prompt_time") or ts
    last_ts = ts if kind == "PROMPT" else fm.get("last_prompt_time", ts)
    exchanges = num
    if not body:
        body = (
            f"\n# Session Log - {first_ts[:10]}\n\n"
            f"Session: `{session_id[:8]}` | Project: `{PROJECT}` | Author: `{AUTHOR}`\n\n---\n"
        )
    entry = (
        f"\n[LOG_ENTRY type={kind} num={num} session={session_id[:8]}]\n"
        f"timestamp: {ts}\n"
        f"model: {model}\n\n"
        f"{content.rstrip()}\n\n"
    )
    write_frontmatter(path, session_id, model, first_ts, last_ts, exchanges, body + entry)
    return path


def count_entries(session_id, kind):
    found = glob.glob(os.path.join(LOG_DIR, f"*_{session_id}.md"))
    if not found:
        return 0
    return len(re.findall(rf"^\[LOG_ENTRY type={kind} num=\d+", read_file(found[0]), re.M))


def transcript_turns(transcript_path):
    """Yield (prompt_text, prompt_ts, response_text, response_ts, model) per real user turn."""
    turns = []
    cur = None
    with open(transcript_path, encoding="utf-8") as f:
        for line in f:
            try:
                d = json.loads(line)
            except Exception:
                continue
            if d.get("isSidechain"):
                continue
            t = d.get("type")
            m = d.get("message") or {}
            c = m.get("content")
            if t == "user":
                blocks = [{"type": "text", "text": c}] if isinstance(c, str) else (c or [])
                if any(b.get("type") == "tool_result" for b in blocks):
                    if cur:
                        cur["tail"] = []  # a tool ran: whatever text came before is not the final response
                    continue
                text = "\n".join(b.get("text", "") for b in blocks if b.get("type") == "text")
                if not text.strip() or d.get("isMeta"):
                    continue
                if text.lstrip().startswith("<command-name>") or text.lstrip().startswith("<local-command"):
                    continue
                cur = {"prompt": text, "pts": d.get("timestamp", ""), "tail": [], "model": "", "rts": ""}
                turns.append(cur)
            elif t == "assistant" and cur is not None:
                blocks = c if isinstance(c, list) else []
                if any(b.get("type") == "tool_use" for b in blocks):
                    cur["tail"] = []
                    continue
                texts = [b.get("text", "") for b in blocks if b.get("type") == "text"]
                if texts:
                    cur["tail"].append("\n".join(texts))
                    cur["model"] = m.get("model") or cur["model"]
                    cur["rts"] = d.get("timestamp", cur["rts"])
    return turns


def on_prompt(payload):
    session_id = payload["session_id"]
    prompt = payload.get("prompt", "")
    ts = now_iso()
    num = count_entries(session_id, "PROMPT") + 1
    # The prompt payload carries no model name; use the model the transcript last answered with,
    # else the last one seen in this log, else say so (the RESPONSE entry always has the real one).
    model = transcript_model(payload.get("transcript_path", "")) or last_model(session_id) or "unknown-until-first-response"
    append_entry(session_id, "PROMPT", num, ts, model, prompt)


def transcript_model(tp):
    if not tp or not os.path.exists(tp):
        return ""
    model = ""
    with open(tp, encoding="utf-8") as f:
        for line in f:
            if '"model"' not in line:
                continue
            try:
                d = json.loads(line)
            except Exception:
                continue
            if d.get("type") == "assistant":
                model = (d.get("message") or {}).get("model") or model
    return model


def last_model(session_id):
    found = glob.glob(os.path.join(LOG_DIR, f"*_{session_id}.md"))
    if not found:
        return ""
    ms = re.findall(r"^model: (.+)$", read_file(found[0]), re.M)
    return ms[-1] if ms else ""


def on_stop(payload):
    session_id = payload["session_id"]
    tp = payload.get("transcript_path", "")
    if not tp or not os.path.exists(tp):
        return
    turns = transcript_turns(tp)
    if not turns:
        return
    prompts = count_entries(session_id, "PROMPT")
    responses = count_entries(session_id, "RESPONSE")
    # The prompt hook may not have fired (session started before install): backfill missing prompts.
    while prompts < len(turns):
        t = turns[prompts]
        append_entry(session_id, "PROMPT", prompts + 1, t["pts"] or now_iso(), t["model"] or last_model(session_id) or "unknown-until-first-response", t["prompt"])
        prompts += 1
    if responses >= prompts:
        return
    turn = turns[prompts - 1]
    text = "\n\n".join(turn["tail"]).strip() or "(no final text response in this turn)"
    ts = turn["rts"] or now_iso()
    append_entry(session_id, "RESPONSE", prompts, ts, turn["model"] or last_model(session_id) or "unknown", text)
    # If the log already has the prompt numbers but the model was unknown at prompt time, keep as is (no edits).


def backfill(transcript_path, session_id=None):
    """Rebuild every exchange from a transcript that is not in the log yet (used once, for the
    session in which the hook was installed and therefore could not fire)."""
    turns = transcript_turns(transcript_path)
    if session_id is None:
        session_id = os.path.basename(transcript_path).split(".")[0]
    have_p = count_entries(session_id, "PROMPT")
    have_r = count_entries(session_id, "RESPONSE")
    for i, t in enumerate(turns, 1):
        if i > have_p:
            append_entry(session_id, "PROMPT", i, t["pts"], t["model"] or "unknown-until-first-response", t["prompt"])
        if i > have_r and t["tail"]:
            append_entry(session_id, "RESPONSE", i, t["rts"], t["model"] or "unknown", "\n\n".join(t["tail"]).strip())


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "stop"
    if mode == "backfill":
        backfill(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
        return
    try:
        payload = json.load(sys.stdin)
    except Exception:
        payload = {}
    if not payload.get("session_id"):
        return
    try:
        if mode == "prompt":
            on_prompt(payload)
        else:
            on_stop(payload)
    except Exception as e:  # never block the agent because of the logger
        sys.stderr.write(f"capture.py {mode} failed: {e}\n")


if __name__ == "__main__":
    main()
