import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";

const APP_PACKAGES = [
  "@deazly/storefront",
  "@deazly/vendor",
  "@deazly/admin",
  "@deazly/warehouse",
  "@deazly/api",
  "@deazly/worker",
];

const GLOBAL_BANS = [
  {
    group: ["@deazly/*/src", "@deazly/*/src/**", "@deazly/*/dist", "@deazly/*/dist/**"],
    message:
      "Import shared code only through its public @deazly/<pkg> entry point; deep/private subpaths are prohibited (ADR-005).",
  },
  {
    group: ["../../apps/*/src/**", "../../packages/*/src/**", "../../../apps/*/src/**", "../../../packages/*/src/**"],
    message: "Do not reach across workspaces with relative paths; use the public @deazly/<pkg> entry point (ADR-005).",
  },
];

const APP_BANS = [
  {
    group: APP_PACKAGES,
    message: "Only composition/bootstrap code may import an application package; regular modules must not (ADR-005).",
  },
];

const BROWSER_BANS = [
  {
    group: ["@deazly/database", "@deazly/config"],
    message: "Server-only packages cannot be imported from a browser workspace (ADR-005).",
  },
];

const SERVER_BANS = [
  {
    group: ["@deazly/ui"],
    message: "The browser-only package cannot be imported from a server workspace (ADR-005).",
  },
];

const NEUTRAL_BANS = [
  {
    group: ["@deazly/database", "@deazly/ui", "@deazly/config"],
    message: "Framework-neutral packages must not depend on runtime packages (ADR-005).",
  },
];

const CONTRACTS_BANS = [
  {
    group: ["@deazly/validation"],
    message: "Contracts may depend on the shared kernel only, not on other packages (ADR-005).",
  },
];

const DYNAMIC_GLOBS = [
  { patterns: ["@deazly/*/src", "@deazly/*/src/**"], regex: "^@deazly/[^/]+/src(?:/.*)?$" },
  { patterns: ["@deazly/*/dist", "@deazly/*/dist/**"], regex: "^@deazly/[^/]+/dist(?:/.*)?$" },
  { patterns: ["../../apps/*/src/**", "../../../apps/*/src/**"], regex: "^(?:\\.\\./)+apps/[^/]+/src(?:/.*)?$" },
  {
    patterns: ["../../packages/*/src/**", "../../../packages/*/src/**"],
    regex: "^(?:\\.\\./)+packages/[^/]+/src(?:/.*)?$",
  },
];

function dynamicImportSelector(regex) {
  return `ImportExpression[source.value=/${regex.replaceAll("/", "\\/")}/]`;
}

function dynamicSelectorFor(pattern) {
  if (!pattern.includes("*")) {
    return `ImportExpression[source.value=${JSON.stringify(pattern)}]`;
  }
  const glob = DYNAMIC_GLOBS.find((candidate) => candidate.patterns.includes(pattern));
  return glob ? dynamicImportSelector(glob.regex) : undefined;
}

function dynamicRestrictions(bans) {
  const seen = new Set();
  const restrictions = [];
  for (const ban of bans) {
    for (const pattern of ban.group) {
      const selector = dynamicSelectorFor(pattern);
      if (!selector || seen.has(selector)) {
        continue;
      }
      seen.add(selector);
      restrictions.push({ selector, message: `Dynamic import blocked: ${ban.message}` });
    }
  }
  return restrictions;
}

const JS_FILES = ["**/*.{cjs,js,mjs}"];
const TS_FILES = ["**/*.{ts,tsx}"];

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.pnpm/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: JS_FILES,
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "no-restricted-imports": ["error", { patterns: [...GLOBAL_BANS, ...APP_BANS] }],
      "no-restricted-syntax": ["error", ...dynamicRestrictions([...GLOBAL_BANS, ...APP_BANS])],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: TS_FILES,
    rules: {
      "@typescript-eslint/no-restricted-imports": ["error", { patterns: [...GLOBAL_BANS, ...APP_BANS] }],
      "no-restricted-syntax": ["error", ...dynamicRestrictions([...GLOBAL_BANS, ...APP_BANS])],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    files: ["apps/storefront/**", "apps/vendor/**", "apps/admin/**", "apps/warehouse/**", "packages/ui/**"],
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        { patterns: [...GLOBAL_BANS, ...APP_BANS, ...BROWSER_BANS] },
      ],
      "no-restricted-syntax": ["error", ...dynamicRestrictions([...GLOBAL_BANS, ...APP_BANS, ...BROWSER_BANS])],
    },
  },
  {
    files: ["apps/api/**", "apps/worker/**", "packages/database/**", "packages/config/**"],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        { patterns: [...GLOBAL_BANS, ...APP_BANS, ...SERVER_BANS] },
      ],
      "no-restricted-syntax": ["error", ...dynamicRestrictions([...GLOBAL_BANS, ...APP_BANS, ...SERVER_BANS])],
    },
  },
  {
    files: ["packages/contracts/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        { patterns: [...GLOBAL_BANS, ...APP_BANS, ...NEUTRAL_BANS, ...CONTRACTS_BANS] },
      ],
      "no-restricted-syntax": [
        "error",
        ...dynamicRestrictions([...GLOBAL_BANS, ...APP_BANS, ...NEUTRAL_BANS, ...CONTRACTS_BANS]),
      ],
    },
  },
  {
    files: ["packages/validation/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        { patterns: [...GLOBAL_BANS, ...APP_BANS, ...NEUTRAL_BANS] },
      ],
      "no-restricted-syntax": ["error", ...dynamicRestrictions([...GLOBAL_BANS, ...APP_BANS, ...NEUTRAL_BANS])],
    },
  },
  prettier,
);
