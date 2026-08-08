# UTM FB2 Queue v5.5

Windows/PowerShell utility for queued EGAIS `QueryRestBCode` requests by Form 2 (FB2), with a local web UI.

## v5.5
- search by full or partial FB2;
- status filtering;
- per-row **Отправить** button for an immediate request;
- configurable UTM URL, allowed time window and interval;
- response/Ticket tracking and retry states.

## Public repository note
This GitHub copy is intentionally sanitized. Customer FSRAR IDs and the live FB2 list are not committed because this repository is public. The production build should keep its real `QueryRestBCode.template.xml`, `fb2.txt`, `state.json`, logs and UTM responses locally.

The v5.5 UI implementation is in `WebUI.ps1`. It is intended to replace the same file in the v5.4/v5.3 production directory while preserving `state.json`.
