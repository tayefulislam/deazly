---
tags: [git, security, planning]
status: PROPOSED
approval: PENDING
execution_authorized: false
decision_owner: Project Owner
review_status: PENDING
revision: 1
created: 2026-10-19
---
# Git Setup and Architecture Baseline Plan

> [!danger] PLAN ONLY — DO NOT INITIALIZE OR COMMIT
> Project Owner approved preservation of the existing repository and creation of the root `.gitignore`. This does not authorize `git init`, commit, push, history rewrite, scanner installation or Foundation Gate activation.

## 1. Inspected repository and sensitive-file evidence

Project root: E:\Projects\deazly. At session start read-only git rev-parse reported no repository, and the inventory contained 53 documentation files with no application manifests/source/migrations, .git or .gitignore. The prior report's empty project placeholder was already absent; it was not deleted by this task.

During preparation, an external actor created .git, a root README containing only the project heading, and a main commit e5bd5da26def292260292c026abd25ff4985ae54. Read-only Git object inspection found 60 committed paths, including the six new proposal documents; remote configuration is present (URL/credentials deliberately not printed). This agent did not initialize, stage, commit, configure a remote or push. That commit is an observed candidate, not an approved or security-reviewed foundation baseline. Do not reinitialize, delete .git, replace the remote or rewrite the commit. Inspect/adopt the existing repository with owner authorization instead. Ordinary Git status/staged review is still required; shell launch later failed with Access is denied, so do not claim the working tree/index is clean.

Scan the current complete file set again before Git execution, not just the earlier baseline. Check hidden files, .env variants, private-key/key-store/credential files, registry auth, database/provider connection strings, tokens and high-confidence credential patterns. Report paths/classifications, never secret values. Inspect Markdown and archived/update notes as well as code. A heuristic scan with no candidates is not a guarantee of no secrets or a substitute for an approved scanner and manual staged review. Runtime logs, uploads, private evidence, database dumps and generated outputs must not enter the baseline.

Selected scanner: Gitleaks v8.30.0, pinned to the official Windows x64 release. The Project Owner authorized selection and documented preparation, not installation. The executable was not found in the conventional locations checked; the restricted host could not run `where.exe` or scanner commands. No Gitleaks scan was executed. Installation and scan requirements are recorded in section 2.1. Before commit, provision this exact version under separate authority; verify the official release archive against its accompanying SHA-256 checksum, record `gitleaks version`, and scan all reachable Git history plus the complete working tree with fully redacted output. If checksum verification fails or a credential is found, stop, restrict evidence, arrange credential rotation/redaction and rescan. Never rewrite history to conceal a finding.

No scanner result is claimed. Earlier heuristic checks found no high-confidence candidates, but cannot replace the pinned scanner or manual staged review.

## 2. Ignore requirements

The root `.gitignore` has now been created under explicit Project Owner authorization. Its rules cover environment secrets, credentials/private keys, dependencies, generated outputs, local databases/data, logs, temporary files and OS artifacts. Sanitized `.env.example` and `.env.*.example` files remain trackable. Positive/negative `git check-ignore` tests remain pending because Git command execution is unavailable. The rules do not ignore source, documentation, manifests, lockfiles or sanitized examples.

The authorized root `.gitignore` has been created. It covers nested node_modules, local pnpm caches, .next/out/dist/build outputs, coverage and Playwright/test reports, logs, local service data/uploads/dumps and OS temporary files. It ignores .env and .env.* while permitting sanitized examples; excludes private keys/key stores and local credential files; and does not use blanket source/documentation exceptions. Positive/negative ignore verification remains pending.

Keep pnpm-lock.yaml, package manifests, source, required tests, approved docs, migrations and sanitized examples trackable. Do not hide source directories, all JSON/YAML or the entire Obsidian vault. If Obsidian machine-specific workspace state appears, review targeted ignores rather than deleting vault configuration. A future .npmrc must be credential-free if committed; tokens belong in authorized environment/secret storage. No .npmrc is required by M1-T01.

### 2.1 Pinned secret-scanner installation and execution

Scanner: [Gitleaks v8.30.0 official release](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.0), Windows x64 asset `gitleaks_8.30.0_windows_x64.zip`. Download only the archive and matching checksum manifest from that exact official release page. Compare the archive SHA-256 with its manifest before extraction; stop on missing/mismatched checksum. Extract `gitleaks.exe` to a user-managed tools directory outside this repository, do not add it to Git, then verify `gitleaks version` reports v8.30.0. No installer script, Docker image, third-party package manager, repository hook or network service is required. Installation needs separate authorization and has not been performed.

After provisioning, run from the repository root with full redaction and no report file in the repository:

```powershell
gitleaks version
gitleaks git --redact=100 --no-color --log-opts="--all" .
gitleaks dir --redact=100 --no-color .
```

The Git mode scans commit patches reachable through local refs (including `main` and `origin/main`); the directory mode scans the complete working tree, including untracked files. Record scanner version, SHA-256, commit SHA, command exit codes and redacted finding counts/paths only. Never paste finding values into logs. Inspect each candidate locally and determine credential rotation needs; do not add broad allowlists or create a baseline that suppresses findings without owner review. [Gitleaks documents the `git` and `dir` scan modes](https://github.com/gitleaks/gitleaks#usage). The v8.30.1 Windows x64 release has a reported checksum mismatch, so v8.30.0 is selected as the reproducible pin pending normal security advisory review. [Reported release checksum issue](https://github.com/gitleaks/gitleaks/issues/2164).

Verify both positive and negative ignore examples with git check-ignore after initialization: .env.local/node_modules/build output ignored; .env.example, lockfile, docs and required tests not ignored. Inspect exclusion rules before trusting a clean status.

## 3. Proposed initialization sequence — separate approvals required

1. Confirm root, full file inventory/hash snapshot, absence of ancestor/nested repositories, ownership and user changes. Confirm approved scanner, commit identity and exact initialization/commit scope. No remote is selected.
2. Authorize/create only ignore rules; review them and the complete intended baseline. Any staging candidate with sensitive content blocks the commit.
3. Inspect the existing main repository and remote without exposing credentials. Do not run git init again. If this plan is reused where no repository exists, initialization requires a fresh explicit git init -b main authorization in this root only. Do not initialize inside docs or create a nested marketplace repository. Inspect status; no application permission follows.
4. Stage an explicit reviewed allowlist: .gitignore, AGENTS.md, productStucture.md, UPDATE-NOTES.md and docs/. These include historical proposals as history, not as newly approved decisions. Inspect all candidates first; do not blindly git add . or silently rename the structural sketch.
5. Review git diff --cached --name-status, --stat and --check and inspect the full staged patch locally without exposing credentials in shared logs. Run the approved scanner against the staged snapshot, not merely the working tree; record tool version, scope, exit result and redacted finding handling.
6. Recheck task IDs, milestone structure, approval metadata, feature rows and historical progress. Obtain explicit authority for any commit and the intended author identity; do not guess or change global Git identity.
7. Review the existing candidate commit and, under explicit owner authority, adopt it or add a follow-up sanitized architecture/planning commit, proposed message docs(architecture): record planning baseline. Never amend/reset the external commit by inference. Record the accepted SHA/date and which documents remain PROPOSED. A commit may precede later approvals; it must not claim all decisions are approved.
8. Before M1-T01 execution, separately commit authorized approval/governance/final-handoff updates if needed. Record the resulting final pre-code baseline SHA on a clean planned task branch; ensure it includes operative foundation approval. An unapproved draft-only commit is not sufficient activation evidence.

No commit, tag, remote creation or push is implicit in this plan. No scanning download script, global Git configuration change or secret-bearing command line is authorized. An initial docs commit can occur without full Gate 0 if separately authorized; it never authorizes application coding.

## 4. Branches, commits and single-writer control

Recommend main plus short-lived reviewed branches: docs/foundation-approval for planning and chore/m1-t01-workspace for the eventual task. No long-lived develop branch is required initially. Configure remote protection/required checks only after a hosting/remote decision and explicit authorization.

Use clear conventional messages, for example docs(architecture): propose foundation gate and chore(workspace): initialize private pnpm workspace. Keep planning approval changes separate from workspace implementation. No commit implies acceptance; review/task evidence is still required. One tool writes at a time; OpenCode implements only a final approved handoff and reports evidence; a designated authorized writer synchronizes progress. No force pushes, automatic signing-identity assumptions or automated task closure.

## 5. Baseline evidence, rollback and approval checklist

Record exact root, scanner/version/results, reviewed allowlist, ignore checks, author approval, branch, baseline SHA, diff and documentation-preservation results. Preserve all 277 IDs, M0–M12, approved ADR-005 and all existing progress history.

For later workspace recovery use an approved revert of the exact task commit, preserving the docs baseline. If task changes are uncommitted, inspect their per-file manifest and recover only those authorized paths; stop if mixed with user changes. Do not delete .git, recursively clean the repository, reset --hard, rewrite history or purge shared dependency caches. A finding after a commit requires an incident/credential response and explicit history-remediation authority, not a silent rewrite.

- Project Owner approval for root ignore rules: APPROVED; `.gitignore` created; `git check-ignore` positive and negative checks pass. Git initialization was not needed.
- Scanner selection: Gitleaks v8.30.0. Provisioned 2026-10-19 from the official Windows x64 release; archive SHA-256 verified (`54fe94f644b832dd08e8c3a5915efb3bfa862386d59fb27ca0792cb687a83573`); `gitleaks version` reports 8.30.0. Full-history (3 commits) and working-tree scans ran with `--redact=100` and found no leaks.
- Initial commit author identity and commit authorization: docs-only baseline commit AUTHORIZED by Project Owner 2026-10-19; resulting pre-code baseline SHA and task branch recorded in [[06-Implementation/PROGRESS-LOG]].
- Earlier observed commits: `e5bd5da26def292260292c026abd25ff4985ae54` then `ddd8d1a0e46f2e0badaaa0253425bd5f789a6f91` (pre-baseline). No history rewrite occurred.
- Any remote/push/deployment permission: NOT GRANTED; no push was performed.
