import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { ESLint } from "eslint";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");

const APPROVED = {
  eslint: "10.13.0",
  "@eslint/js": "10.0.1",
  "typescript-eslint": "8.71.2",
  globals: "17.13.0",
  "eslint-config-prettier": "10.1.8",
  prettier: "3.9.10",
};

const BOUNDARY_RULES = new Set(["@typescript-eslint/no-restricted-imports", "no-restricted-syntax"]);

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(REPO_ROOT, relativePath), "utf8"));
}

let eslint;

before(() => {
  eslint = new ESLint({ cwd: REPO_ROOT });
});

async function boundaryErrors(filePath, code) {
  const results = await eslint.lintText(code, { filePath: join(REPO_ROOT, filePath) });
  return results[0].messages.filter((message) => BOUNDARY_RULES.has(message.ruleId));
}

describe("lint and format dependency pins", () => {
  const manifest = readJson("package.json");

  test("pins exactly the approved lint/format toolchain", () => {
    for (const [name, version] of Object.entries(APPROVED)) {
      assert.equal(manifest.devDependencies?.[name], version, name);
    }
    assert.equal(manifest.devDependencies?.typescript, "6.0.3");
  });

  test("exposes lint, format and lint-test scripts", () => {
    for (const script of ["lint", "lint:fix", "format", "format:check", "test:lint"]) {
      assert.equal(typeof manifest.scripts?.[script], "string", script);
    }
    assert.match(manifest.scripts.test, /tests\/lint\/lint\.test\.mjs/);
  });

  test("installed eslint and prettier match the pins", () => {
    assert.equal(readJson("node_modules/eslint/package.json").version, APPROVED.eslint);
    assert.equal(readJson("node_modules/prettier/package.json").version, APPROVED.prettier);
  });
});

describe("import boundaries - negative fixtures", () => {
  const cases = [
    {
      label: "browser workspace importing a deep package path",
      filePath: "apps/storefront/src/__fixture__.ts",
      code: 'import { x } from "@deazly/ui/src/index";\n',
    },
    {
      label: "browser workspace importing a server-only package",
      filePath: "apps/storefront/src/__fixture__.ts",
      code: 'import { x } from "@deazly/database";\n',
    },
    {
      label: "browser package importing server-only config",
      filePath: "packages/ui/src/__fixture__.ts",
      code: 'import { x } from "@deazly/config";\n',
    },
    {
      label: "server workspace importing the browser-only package",
      filePath: "apps/api/src/__fixture__.ts",
      code: 'import { x } from "@deazly/ui";\n',
    },
    {
      label: "package importing an application",
      filePath: "packages/database/src/__fixture__.ts",
      code: 'import { x } from "@deazly/storefront";\n',
    },
    {
      label: "neutral package importing a runtime package",
      filePath: "packages/validation/src/__fixture__.ts",
      code: 'import { x } from "@deazly/ui";\n',
    },
    {
      label: "contracts importing another package",
      filePath: "packages/contracts/src/__fixture__.ts",
      code: 'import { x } from "@deazly/validation";\n',
    },
    {
      label: "relative escape into another workspace",
      filePath: "apps/vendor/src/__fixture__.ts",
      code: 'import { x } from "../../../packages/ui/src/index";\n',
    },
  ];

  for (const testCase of cases) {
    test(testCase.label, async () => {
      const errors = await boundaryErrors(testCase.filePath, testCase.code);
      assert.ok(errors.length >= 1, `expected a boundary error for ${testCase.filePath}`);
    });
  }
});

describe("import boundaries - positive fixtures", () => {
  const cases = [
    {
      label: "browser workspace importing a neutral package entry point",
      filePath: "apps/storefront/src/__fixture__.ts",
      code: 'import { x } from "@deazly/contracts";\n',
    },
    {
      label: "server workspace importing a server package entry point",
      filePath: "apps/api/src/__fixture__.ts",
      code: 'import { x } from "@deazly/database";\n',
    },
    {
      label: "browser workspace importing the shared UI entry point",
      filePath: "apps/admin/src/__fixture__.ts",
      code: 'import { x } from "@deazly/ui";\n',
    },
    {
      label: "own-relative import",
      filePath: "packages/validation/src/__fixture__.ts",
      code: 'import { x } from "./other";\n',
    },
  ];

  for (const testCase of cases) {
    test(testCase.label, async () => {
      const errors = await boundaryErrors(testCase.filePath, testCase.code);
      assert.equal(errors.length, 0);
    });
  }
});

describe("literal dynamic imports - negative fixtures", () => {
  const cases = [
    {
      label: "browser workspace dynamic-importing a server-only package",
      filePath: "apps/storefront/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/database");\n',
    },
    {
      label: "dynamic import of a deep package subpath",
      filePath: "apps/storefront/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/ui/src/index");\n',
    },
    {
      label: "dynamic relative escape into another workspace",
      filePath: "apps/vendor/src/__fixture__.ts",
      code: 'export const load = () => import("../../../packages/ui/src/index");\n',
    },
    {
      label: "server workspace dynamic-importing the browser-only package",
      filePath: "apps/api/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/ui");\n',
    },
    {
      label: "contracts dynamically importing another package",
      filePath: "packages/contracts/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/validation");\n',
    },
    {
      label: "package dynamically importing an application",
      filePath: "packages/database/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/admin");\n',
    },
  ];

  for (const testCase of cases) {
    test(testCase.label, async () => {
      const errors = await boundaryErrors(testCase.filePath, testCase.code);
      assert.ok(errors.length >= 1, `expected a boundary error for ${testCase.filePath}`);
    });
  }
});

describe("literal dynamic imports - positive fixtures", () => {
  const cases = [
    {
      label: "browser workspace dynamically importing a neutral package entry point",
      filePath: "apps/storefront/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/contracts");\n',
    },
    {
      label: "server workspace dynamically importing a server package entry point",
      filePath: "apps/api/src/__fixture__.ts",
      code: 'export const load = () => import("@deazly/database");\n',
    },
    {
      label: "own-relative dynamic import",
      filePath: "packages/validation/src/__fixture__.ts",
      code: 'export const load = () => import("./other");\n',
    },
  ];

  for (const testCase of cases) {
    test(testCase.label, async () => {
      const errors = await boundaryErrors(testCase.filePath, testCase.code);
      assert.equal(errors.length, 0);
    });
  }
});

describe("dynamic import enforcement limits", () => {
  test("non-literal dynamic imports are not statically analysable (deferred)", async () => {
    const code = 'const target = "@deazly/database";\nexport const load = () => import(target);\n';
    const errors = await boundaryErrors("apps/storefront/src/__fixture__.ts", code);
    assert.equal(errors.length, 0);
  });
});

describe("config shape", () => {
  test("applies eslint-config-prettier last", () => {
    const text = readFileSync(join(REPO_ROOT, "eslint.config.mjs"), "utf8");
    assert.match(text, /import prettier from "eslint-config-prettier";/);
    assert.match(text, /\n\s*prettier,\s*\n\);\s*$/);
  });

  test("prettier ignores documentation and the lockfile", () => {
    const ignore = readFileSync(join(REPO_ROOT, ".prettierignore"), "utf8");
    assert.match(ignore, /^docs\/$/m);
    assert.match(ignore, /^\*\.md$/m);
    assert.match(ignore, /^pnpm-lock\.yaml$/m);
  });

  test("enforces literal dynamic imports with no-restricted-syntax", () => {
    const text = readFileSync(join(REPO_ROOT, "eslint.config.mjs"), "utf8");
    assert.match(text, /"no-restricted-syntax"/);
    assert.match(text, /ImportExpression\[source\.value=/);
  });
});
