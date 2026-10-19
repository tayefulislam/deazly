# Deazly Obsidian Update — 2026-10-19

This ZIP is an updated copy of the user-supplied `deazly.zip`, using the attached Codex planning report as the change basis.

## Updated

- Preserved 277 original canonical task IDs, all unique.
- Normalized the authoritative task backlog to 271 `BLOCKED` and 6 `NOT_STARTED` tasks; preserved blocker reasons in a separate column. No tasks declared completed.
- Aligned `PROJECT-STATUS.md` and `CURRENT-SPRINT.md` with the M0–M12 roadmap; `M1-T01` foundation remains blocked by Gate 0.
- Preserved original progress history and appended a documentation update entry.
- Updated root and docs `AGENTS.md` guidance and `00-START-HERE.md` links.
- Added explicit guidance on at-least-once outbox processing and idempotent consumer effects.
- Clarified mistaken recommendation-privacy `BR-10` reference; did not invent a policy ID.
- Annotated readiness, milestone, dependency and architecture audit documents.

## New Markdown documents

1. `docs/09-Implementation/Milestone-Reconciliation.md`
2. `docs/09-Implementation/Task-Status-Policy.md`
3. `docs/05-Architecture/ADRs/ADR-005-Module-Boundaries.md`
4. `docs/09-Implementation/Feature-Coverage-Gaps.md`

## Intentionally unresolved

- ADR-005 is only **PROPOSED** and cannot be treated as approved or as M0-T05 complete.
- ADR-001–ADR-004, country/tax/COD/shipping/returns and other open policy decisions remain pending.
- Some detailed backlog dependencies have known ambiguity and require explicit approval before reworking task edges.
- Original migration sequence M001–M012 conflicts are documented, not silently renumbered.
- Gate 0 sign-off remains **0/35** as reported by the supplied Codex output.
- No Git repository, package installations, production code, tests or deployment were created as part of this ZIP.

## Suggested next action

Open the vault and review `docs/09-Implementation/Milestone-Reconciliation.md` and `docs/05-Architecture/ADRs/ADR-005-Module-Boundaries.md` in Codex CLI. Approve or amend them, then complete M0-T12 (ADR index and decision log). Do not start OpenCode coding until Gate 0 is formally cleared.
