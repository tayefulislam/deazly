# deazly

Deazly is a multi-vendor marketplace. The architecture, business rules, and UI/UX
specifications live in [`docs/00-START-HERE.md`](docs/00-START-HERE.md).

## Workspace foundation (M1-T01) and TypeScript configuration (M1-T02)

This repository root is a **private pnpm workspace** with a pinned, strict
TypeScript toolchain. It currently contains only private package placeholders.
**No application code has been implemented** — no framework, ORM, API, worker,
UI, database or infrastructure code exists yet.

- Package manager: **pnpm 12.14.0**
- Node.js: **24.22.0**
- TypeScript: **6.0.3** (exact, root dev dependency)
- Workspaces: `apps/*` (six applications) and `packages/*` (five shared packages)

| Path | Package | State |
|---|---|---|
| `apps/storefront` | `@deazly/storefront` | placeholder only |
| `apps/vendor` | `@deazly/vendor` | placeholder only |
| `apps/admin` | `@deazly/admin` | placeholder only (future finance placement) |
| `apps/warehouse` | `@deazly/warehouse` | placeholder only |
| `apps/api` | `@deazly/api` | placeholder only (no server bootstrap) |
| `apps/worker` | `@deazly/worker` | placeholder only (no processor) |
| `packages/database` | `@deazly/database` | placeholder only (no ORM/schema) |
| `packages/ui` | `@deazly/ui` | placeholder only (no components) |
| `packages/contracts` | `@deazly/contracts` | placeholder only (no types) |
| `packages/validation` | `@deazly/validation` | placeholder only (no validators) |
| `packages/config` | `@deazly/config` | placeholder only (no env loader) |

### Provision the approved toolchain

M1-T01 does not install a runtime. Provision the exact pins separately and verify
them before running workspace commands:

```powershell
node --version   # must print v24.22.0
pnpm --version   # must print 12.14.0
```

### Verify the workspace and TypeScript configuration

```powershell
pnpm install --frozen-lockfile --offline --ignore-scripts --no-runtime
pnpm --recursive list --depth -1 --json
pnpm run test:workspace
pnpm run test:typescript
pnpm run typecheck
```

A passing workspace test only verifies workspace metadata and discovery. The
TypeScript test verifies the shared strict base, the eleven inheriting configs,
the dependency pin and alias boundaries. `pnpm run typecheck` only checks the
placeholder `src/index.ts` files; it does **not** build or run an application and
is **not** the M1 exit gate.

### TypeScript configuration layout

`tsconfig.base.json` holds the shared strict options. Each workspace extends it and
declares only its runtime boundary:

- Browser (`apps/storefront`, `apps/vendor`, `apps/admin`, `apps/warehouse`, `packages/ui`): `DOM` + `ES2023`, `ESNext`/`Bundler`, `jsx: preserve`.
- Server (`apps/api`, `apps/worker`, `packages/database`, `packages/config`): `ES2023`, `NodeNext`/`NodeNext`.
- Neutral (`packages/contracts`, `packages/validation`): `ES2023`, `ESNext`/`Bundler`, no DOM.
- Applications map `@deazly/*` only to `packages/*/src/index.ts`; packages declare no cross-package aliases.
- Project references and `composite` are intentionally excluded.

### Out of scope for M1-T01 / M1-T02

Lint/import-boundary enforcement (M1-T03), Docker (M1-T04), the ORM/migration
decision (M1-T05/M0-T02), the NestJS API skeleton (M1-T23), CI (M1-T25), and every
M2–M12 milestone remain blocked and unapproved. Full Gate 0 is NOT READY; only
M1-T01 and M1-T02 were authorized by the temporary Foundation Development Gate
exception. M1-T03 and later tasks are not authorized.

### Approvals

- ADRs and the Foundation Gate: [`docs/05-Architecture/ADRs/ADR-Index.md`](docs/05-Architecture/ADRs/ADR-Index.md) and [`docs/09-Implementation/Foundation-Development-Gate.md`](docs/09-Implementation/Foundation-Development-Gate.md)
- Progress tracking: [`docs/06-Implementation/PROJECT-STATUS.md`](docs/06-Implementation/PROJECT-STATUS.md)
