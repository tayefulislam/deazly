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
> Git setup requires separate Project Owner authorization. Preparing this document does not run git init, create .gitignore or grant commit/push authority. It does not activate [[09-Implementation/Foundation-Development-Gate]].

## 1. Inspected repository and sensitive-file evidence

Project root: E:\Projects\deazly. Read-only git rev-parse reports no repository. At session start the inventory contained 53 files, all documentation (plus no application manifests/source/migrations); no .git or .gitignore existed. The prior report's empty project placeholder is absent in this session's actual baseline; it was not deleted by this task.

Scan the current complete file set again before Git execution, not just the earlier baseline. Check hidden files, .env variants, private-key/key-store/credential files, registry auth, database/provider connection strings, tokens and high-confidence credential patterns. Report paths/classifications, never secret values. Inspect Markdown and archived/update notes as well as code. A heuristic scan with no candidates is not a guarantee of no secrets or a substitute for an approved scanner and manual staged review. Runtime logs, uploads, private evidence, database dumps and generated outputs must not enter the baseline.

An approved secret scanner must be selected, version-pinned and provisioned under separate authority before commit; scanner identity/version and invocation remain PENDING, not a fabricated completed check. Do not install it during documentation preparation. If a credential is found, stop staging, restrict evidence, notify the owner for rotation/redaction and rescan; do not commit then delete it in a later commit. Do not rewrite existing history to conceal failures.

## 2. Ignore requirements (future file, not created now)

Create/review a root .gitignore only after explicit authorization. Cover nested node_modules, local pnpm caches, .next/out/dist/build outputs, coverage and Playwright/test reports, logs, local service data/uploads/dumps and OS temporary files. Ignore .env and .env.*; permit only sanitized .env.example equivalents after review. Exclude private keys/key stores and local credential files. Preserve any deliberately public certificate fixture only through explicit review, never a blanket secret exception.

Keep pnpm-lock.yaml, package manifests, source, required tests, approved docs, migrations and sanitized examples trackable. Do not hide source directories, all JSON/YAML or the entire Obsidian vault. If Obsidian machine-specific workspace state appears, review targeted ignores rather than deleting vault configuration. A future .npmrc must be credential-free if committed; tokens belong in authorized environment/secret storage. No .npmrc is required by M1-T01.

Verify both positive and negative ignore examples with git check-ignore after initialization: .env.local/node_modules/build output ignored; .env.example, lockfile, docs and required tests not ignored. Inspect exclusion rules before trusting a clean status.

## 3. Proposed initialization sequence — separate approvals required

1. Confirm root, full file inventory/hash snapshot, absence of ancestor/nested repositories, ownership and user changes. Confirm approved scanner, commit identity and exact initialization/commit scope. No remote is selected.
2. Authorize/create only ignore rules; review them and the complete intended baseline. Any staging candidate with sensitive content blocks the commit.
3. On explicit authorization run git init -b main in this root only. Do not initialize inside docs or create a nested marketplace repository. Inspect status; no application permission follows.
4. Stage an explicit reviewed allowlist: .gitignore, AGENTS.md, productStucture.md, UPDATE-NOTES.md and docs/. These include historical proposals as history, not as newly approved decisions. Inspect all candidates first; do not blindly git add . or silently rename the structural sketch.
5. Review git diff --cached --name-status, --stat and --check and inspect the full staged patch locally without exposing credentials in shared logs. Run the approved scanner against the staged snapshot, not merely the working tree; record tool version, scope, exit result and redacted finding handling.
6. Recheck task IDs, milestone structure, approval metadata, feature rows and historical progress. Obtain explicit authority for the initial commit and the intended author identity; do not guess or change global Git identity.
7. Commit the sanitized architecture/planning baseline, proposed message docs(architecture): record planning baseline. Record the actual SHA/date and which documents remain PROPOSED. This commit may precede later approvals; it must not claim all decisions are approved.
8. Before M1-T01 execution, separately commit authorized approval/governance/final-handoff updates if needed. Record the resulting final pre-code baseline SHA on a clean planned task branch; ensure it includes operative foundation approval. An unapproved draft-only commit is not sufficient activation evidence.

No commit, tag, remote creation or push is implicit in this plan. No scanning download script, global Git configuration change or secret-bearing command line is authorized. An initial docs commit can occur without full Gate 0 if separately authorized; it never authorizes application coding.

## 4. Branches, commits and single-writer control

Recommend main plus short-lived reviewed branches: docs/foundation-approval for planning and chore/m1-t01-workspace for the eventual task. No long-lived develop branch is required initially. Configure remote protection/required checks only after a hosting/remote decision and explicit authorization.

Use clear conventional messages, for example docs(architecture): propose foundation gate and chore(workspace): initialize private pnpm workspace. Keep planning approval changes separate from workspace implementation. No commit implies acceptance; review/task evidence is still required. One tool writes at a time; OpenCode implements only a final approved handoff and reports evidence; a designated authorized writer synchronizes progress. No force pushes, automatic signing-identity assumptions or automated task closure.

## 5. Baseline evidence, rollback and approval checklist

Record exact root, scanner/version/results, reviewed allowlist, ignore checks, author approval, branch, baseline SHA, diff and documentation-preservation results. Preserve all 277 IDs, M0–M12, approved ADR-005 and all existing progress history.

For later workspace recovery use an approved revert of the exact task commit, preserving the docs baseline. If task changes are uncommitted, inspect their per-file manifest and recover only those authorized paths; stop if mixed with user changes. Do not delete .git, recursively clean the repository, reset --hard, rewrite history or purge shared dependency caches. A finding after a commit requires an incident/credential response and explicit history-remediation authority, not a silent rewrite.

- Project Owner approval for ignore creation/initialization: PENDING.
- Scanner selection/provisioning and staged-review evidence: PENDING.
- Initial commit author identity and commit authorization: PENDING.
- Actual baseline SHA/date: NONE — Git not initialized.
- Any remote/push/deployment permission: NOT GRANTED.
