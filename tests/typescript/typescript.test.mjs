import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");

const APPROVED_TYPESCRIPT = "6.0.3";

const WORKSPACES = [
  { path: "apps/storefront", kind: "browser" },
  { path: "apps/vendor", kind: "browser" },
  { path: "apps/admin", kind: "browser" },
  { path: "apps/warehouse", kind: "browser" },
  { path: "apps/api", kind: "server" },
  { path: "apps/worker", kind: "server" },
  { path: "packages/database", kind: "server" },
  { path: "packages/ui", kind: "browser" },
  { path: "packages/contracts", kind: "neutral" },
  { path: "packages/validation", kind: "neutral" },
  { path: "packages/config", kind: "server" },
];

const APP_PATHS = WORKSPACES.filter((w) => w.path.startsWith("apps/")).map((w) => w.path);
const PACKAGE_PATHS = WORKSPACES.filter((w) => w.path.startsWith("packages/")).map((w) => w.path);

const BASE_STRICT_OPTIONS = [
  "strict",
  "noUncheckedIndexedAccess",
  "noImplicitOverride",
  "noFallthroughCasesInSwitch",
  "noUnusedLocals",
  "noUnusedParameters",
  "forceConsistentCasingInFileNames",
  "isolatedModules",
  "verbatimModuleSyntax",
  "exactOptionalPropertyTypes",
];

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(REPO_ROOT, relativePath), "utf8"));
}

export function loadEffectiveConfig(relativePath) {
  const config = readJson(relativePath);
  let inherited = {};
  if (config.extends) {
    const base = readJson(config.extends.replace(/^\.\.\/\.\.\//, ""));
    inherited = base.compilerOptions ?? {};
  }
  return { ...config, compilerOptions: { ...inherited, ...(config.compilerOptions ?? {}) } };
}

export function missingStrictOptions(options) {
  return BASE_STRICT_OPTIONS.filter((name) => options?.[name] !== true);
}

export function isBoundarySafeAlias(alias, target) {
  if (!/^@deazly\/[a-z-]+$/.test(alias)) return false;
  const match = alias.match(/^@deazly\/([a-z-]+)$/);
  if (!match) return false;
  const expected = `../../packages/${match[1]}/src/index.ts`;
  return target === expected;
}

export function hasPrivateSubpathAlias(aliases) {
  return Object.keys(aliases ?? {}).some((alias) => alias.slice("@deazly/".length).includes("/"));
}

describe("shared strict base configuration", () => {
  const base = readJson("tsconfig.base.json");

  test("enables every approved strict option", () => {
    assert.deepEqual(missingStrictOptions(base.compilerOptions), []);
    assert.equal(base.compilerOptions.skipLibCheck, false);
    assert.equal(base.compilerOptions.noEmit, true);
    assert.equal(base.compilerOptions.allowJs ?? false, false);
  });

  test("keeps module, resolution, lib, jsx and target out of the base", () => {
    for (const option of ["module", "moduleResolution", "lib", "jsx", "target", "paths"]) {
      assert.equal(base.compilerOptions[option], undefined, `${option} must be set per workspace`);
    }
  });

  test("does not enable project references", () => {
    assert.equal(base.compilerOptions.composite, undefined);
    assert.equal(base.references, undefined);
  });
});

describe("TypeScript dependency pin", () => {
  const manifest = readJson("package.json");

  test("pins exactly the approved TypeScript version alongside the lint toolchain", () => {
    assert.match(APPROVED_TYPESCRIPT, /^\d+\.\d+\.\d+$/);
    assert.equal(manifest.devDependencies?.typescript, APPROVED_TYPESCRIPT);
    for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
      assert.equal(manifest[field], undefined, field);
    }
  });

  test("exposes reproducible typecheck and test scripts", () => {
    assert.equal(manifest.scripts?.typecheck, manifest.scripts?.typecheck.trim());
    assert.match(manifest.scripts.typecheck, /tsc --noEmit -p /);
    assert.match(manifest.scripts.typecheck, /packages\/config\/tsconfig\.json/);
    assert.match(manifest.scripts["test:typescript"], /tests\/typescript\/typescript\.test\.mjs/);
    assert.match(manifest.scripts.test, /tests\/workspace\/workspace\.test\.mjs/);
    assert.match(manifest.scripts.test, /tests\/typescript\/typescript\.test\.mjs/);
  });
});

describe("workspace TypeScript configurations", () => {
  test("discovers exactly the eleven approved workspace configs", () => {
    assert.equal(WORKSPACES.length, 11);
    assert.equal(APP_PATHS.length, 6);
    assert.equal(PACKAGE_PATHS.length, 5);
  });

  for (const workspace of WORKSPACES) {
    test(`${workspace.path} extends the base with a real input and no emit`, () => {
      const config = loadEffectiveConfig(`${workspace.path}/tsconfig.json`);
      assert.equal(config.extends, "../../tsconfig.base.json");
      assert.deepEqual(config.include, ["src"]);
      assert.equal(config.compilerOptions?.noEmit, true);
      assert.equal(config.compilerOptions?.composite, undefined);
      assert.equal(config.references, undefined);
      assert.equal(existsSync(join(REPO_ROOT, workspace.path, "src", "index.ts")), true);
    });
  }

  for (const workspace of WORKSPACES.filter((w) => w.kind === "browser")) {
    test(`${workspace.path} is configured for a browser runtime`, () => {
      const { compilerOptions } = readJson(`${workspace.path}/tsconfig.json`);
      assert.ok(compilerOptions.lib.includes("DOM"), "DOM lib required");
      assert.ok(!compilerOptions.lib.includes("Node"), "Node lib must not leak into browser code");
      assert.equal(compilerOptions.module, "ESNext");
      assert.equal(compilerOptions.moduleResolution, "Bundler");
      assert.equal(compilerOptions.jsx, "preserve");
    });
  }

  for (const workspace of WORKSPACES.filter((w) => w.kind === "server")) {
    test(`${workspace.path} is configured for a Node runtime`, () => {
      const { compilerOptions } = readJson(`${workspace.path}/tsconfig.json`);
      assert.deepEqual(compilerOptions.lib, ["ES2023"]);
      assert.equal(compilerOptions.module, "NodeNext");
      assert.equal(compilerOptions.moduleResolution, "NodeNext");
      assert.equal(compilerOptions.verbatimModuleSyntax, false);
    });
  }

  for (const workspace of WORKSPACES.filter((w) => w.kind === "neutral")) {
    test(`${workspace.path} is framework-neutral`, () => {
      const { compilerOptions } = readJson(`${workspace.path}/tsconfig.json`);
      assert.deepEqual(compilerOptions.lib, ["ES2023"]);
      assert.equal(compilerOptions.module, "ESNext");
      assert.equal(compilerOptions.moduleResolution, "Bundler");
      assert.equal(compilerOptions.jsx, undefined);
    });
  }
});

describe("path aliases", () => {
  for (const appPath of APP_PATHS) {
    test(`${appPath} maps @deazly/* only to public package entry points`, () => {
      const { compilerOptions } = readJson(`${appPath}/tsconfig.json`);
      const aliases = compilerOptions.paths;
      assert.deepEqual(aliases, { "@deazly/*": ["../../packages/*/src/index.ts"] });
      assert.equal(hasPrivateSubpathAlias(aliases), false);
    });
  }

  for (const packagePath of PACKAGE_PATHS) {
    test(`${packagePath} declares no cross-package aliases`, () => {
      const { compilerOptions } = readJson(`${packagePath}/tsconfig.json`);
      assert.equal(compilerOptions.paths, undefined);
    });
  }

  test("negative fixture rejects private subpath aliases", () => {
    assert.equal(isBoundarySafeAlias("@deazly/ui/src/internal", "../../packages/ui/src/index.ts"), false);
    assert.equal(isBoundarySafeAlias("@deazly/ui", "../../packages/ui/src/internal.ts"), false);
  });

  test("negative fixture rejects aliases that escape into an application", () => {
    assert.equal(isBoundarySafeAlias("@deazly/ui", "../../apps/storefront/src/index.ts"), false);
    assert.equal(isBoundarySafeAlias("@deazly/ui", "../../packages/database/src/index.ts"), false);
  });

  test("positive fixture accepts a public package entry point", () => {
    assert.equal(isBoundarySafeAlias("@deazly/ui", "../../packages/ui/src/index.ts"), true);
  });

  test("negative fixture rejects a missing strict option", () => {
    assert.deepEqual(missingStrictOptions({ strict: true }), [
      "noUncheckedIndexedAccess",
      "noImplicitOverride",
      "noFallthroughCasesInSwitch",
      "noUnusedLocals",
      "noUnusedParameters",
      "forceConsistentCasingInFileNames",
      "isolatedModules",
      "verbatimModuleSyntax",
      "exactOptionalPropertyTypes",
    ]);
  });
});
