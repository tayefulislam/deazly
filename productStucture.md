deazly/
│
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
│
├── docs/
│ ├── 00-START-HERE.md
│ ├── 01-Business-Rules/
│ ├── 02-Architecture/
│ ├── 03-Database/
│ ├── 04-API-Contracts/
│ ├── 05-UI-UX/
│ ├── 06-Workflows/
│ ├── 07-Security/
│ ├── 08-Testing/
│ └── 09-Implementation/
│
├── apps/
│ ├── storefront/ # Customer website
│ ├── vendor/ # Seller Center
│ ├── admin/ # Platform administration
│ ├── warehouse/ # Warehouse dashboard
│ ├── api/ # NestJS backend
│ └── worker/ # Background jobs
│
├── packages/
│ ├── database/ # PostgreSQL + migrations
│ ├── ui/ # Shared components
│ ├── contracts/ # Shared API types
│ ├── validation/ # Zod schemas
│ └── config/
│
├── infrastructure/
│ ├── docker/
│ └── deployment/
│
└── tests/
├── integration/
└── e2e/
