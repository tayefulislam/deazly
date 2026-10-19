import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");

const APPROVED_NODE = "24.22.0";
const APPROVED_PNPM = "12.14.0";
const APPROVED_VERSION = "0.0.0";
const APPROVED_GLOBS = ["apps/*", "packages/*"];
const EXPECTED_WORKSPACES = [
  { path: "apps/storefront", name: "@deazly/storefront" },
  { path: "apps/vendor", name: "@deazly/vendor" },
  { path: "apps/admin", name: "@deazly/admin" },
  { path: "apps/warehouse", name: "@deazly/warehouse" },
  { path: "apps/api", name: "@deazly/api" },
  { path: "apps/worker", name: "@deazly/worker" },
  { path: "packages/database", name: "@deazly/database" },
  { path: "packages/ui", name: "@deazly/ui" },
  { path: "packages/contracts", name: "@deazly/contracts" },
  { path: "packages/validation", name: "@deazly/validation" },
  { path: "packages/config", name: "@deazly/config" },
];
const DEPENDENCY_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
const FORBIDDEN_SCRIPTS = ["preinstall", "install", "postinstall", "prepare"];

// --- Pure helpers (exercised with real repository data and negative fixtures) ---

export function parseWorkspaceGlobs(text) {
  const patterns = [];
  let inPackages = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "");
    if (/^\s*packages\s*:/.test(line)) {
      inPackages = true;
      continue;
    }
    if (!inPackages) continue;
    const item = line.match(/^\s*-\s*["']?([^"'\s]+)["']?\s*$/);
    if (item) {
      patterns.push(item[1]);
    } else if (/^\S/.test(line)) {
      inPackages = false;
    }
  }
  return patterns;
}

export function expandWorkspaceGlobs(root, patterns) {
  const found = [];
  for (const pattern of patterns) {
    const star = pattern.indexOf("/*");
    if (star === -1) {
      if (existsSync(join(root, pattern, "package.json"))) found.push(pattern);
      continue;
    }
    const base = pattern.slice(0, star);
    const dir = join(root, base);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      if (existsSync(join(dir, entry, "package.json"))) {
        found.push(`${base}/${entry}`);
      }
    }
  }
  return found.sort();
}

export function compareWorkspaceSet(actual, expected) {
  const a = [...actual].sort();
  const e = [...expected].sort();
  const missing = e.filter((x) => !a.includes(x));
  const extra = a.filter((x) => !e.includes(x));
  return { ok: missing.length === 0 && extra.length === 0, missing, extra };
}

export function validateWorkspaceManifest(manifest, expectedName) {
  const problems = [];
  if (manifest.name !== expectedName) problems.push(`name ${manifest.name} != ${expectedName}`);
  if (manifest.private !== true) problems.push("private must be true");
  if (manifest.version !== APPROVED_VERSION) problems.push("version must be 0.0.0");
  for (const field of DEPENDENCY_FIELDS) {
    const deps = manifest[field];
    if (deps && Object.keys(deps).length > 0) problems.push(`must not declare ${field}`);
  }
  for (const hook of FORBIDDEN_SCRIPTS) {
    if (manifest.scripts && manifest.scripts[hook]) problems.push(`must not define ${hook}`);
  }
  return problems;
}

export function findDuplicateNames(manifests) {
  const seen = new Set();
  const duplicates = new Set();
  for (const manifest of manifests) {
    if (seen.has(manifest.name)) duplicates.add(manifest.name);
    seen.add(manifest.name);
  }
  return [...duplicates];
}

export function validatePins({ nodeVersion, packageManager, engines }) {
  const problems = [];
  if (nodeVersion.trim() !== APPROVED_NODE) problems.push(".node-version mismatch");
  if (packageManager !== `pnpm@${APPROVED_PNPM}`) problems.push("packageManager mismatch");
  if (!engines || engines.node !== APPROVED_NODE) problems.push("engines.node mismatch");
  if (!engines || engines.pnpm !== APPROVED_PNPM) problems.push("engines.pnpm mismatch");
  return problems;
}

// --- Repository discovery ---

const workspaceYaml = readFileSync(join(REPO_ROOT, "pnpm-workspace.yaml"), "utf8");
const rootManifest = JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8"));
const nodeVersionFile = readFileSync(join(REPO_ROOT, ".node-version"), "utf8");
const discoveredPaths = expandWorkspaceGlobs(REPO_ROOT, parseWorkspaceGlobs(workspaceYaml));
const discoveredManifests = discoveredPaths.map((p) =>
  JSON.parse(readFileSync(join(REPO_ROOT, p, "package.json"), "utf8")),
);

describe("workspace configuration", () => {
  test("declares exactly the approved discovery globs", () => {
    assert.deepEqual(parseWorkspaceGlobs(workspaceYaml), APPROVED_GLOBS);
  });

  test("discovers exactly the eleven approved workspaces", () => {
    const result = compareWorkspaceSet(
      discoveredPaths,
      EXPECTED_WORKSPACES.map((w) => w.path),
    );
    assert.deepEqual(result.missing, [], "missing workspaces");
    assert.deepEqual(result.extra, [], "unexpected workspaces");
    assert.equal(result.ok, true);
    assert.equal(discoveredPaths.length, 11);
  });

  test("every workspace manifest is private, uniquely named and version 0.0.0", () => {
    for (const expected of EXPECTED_WORKSPACES) {
      const manifest = JSON.parse(readFileSync(join(REPO_ROOT, expected.path, "package.json"), "utf8"));
      assert.deepEqual(validateWorkspaceManifest(manifest, expected.name), [], expected.path);
    }
    assert.deepEqual(findDuplicateNames(discoveredManifests), []);
  });

  test("no workspace declares dependencies or lifecycle hooks", () => {
    for (const manifest of discoveredManifests) {
      for (const field of DEPENDENCY_FIELDS) {
        assert.equal(manifest[field] ?? undefined, undefined, `${manifest.name} ${field}`);
      }
      for (const hook of FORBIDDEN_SCRIPTS) {
        assert.equal(manifest.scripts?.[hook] ?? undefined, undefined, `${manifest.name} ${hook}`);
      }
    }
  });
});

describe("root manifest and toolchain pins", () => {
  test("root package is private and exposes the workspace test scripts", () => {
    assert.equal(rootManifest.private, true);
    assert.equal(rootManifest.name, "deazly");
    assert.equal(rootManifest.version, APPROVED_VERSION);
    assert.equal(typeof rootManifest.scripts?.test, "string");
    assert.equal(typeof rootManifest.scripts?.["test:workspace"], "string");
    assert.match(rootManifest.scripts.test, /tests\/workspace\/workspace\.test\.mjs/);
    assert.match(rootManifest.scripts.test, /tests\/typescript\/typescript\.test\.mjs/);
    assert.match(rootManifest.scripts["test:workspace"], /tests\/workspace\/workspace\.test\.mjs/);
    assert.doesNotMatch(rootManifest.scripts["test:workspace"], /tests\/typescript\//);
  });

  test("pins agree across .node-version, packageManager and engines", () => {
    assert.deepEqual(
      validatePins({
        nodeVersion: nodeVersionFile,
        packageManager: rootManifest.packageManager,
        engines: rootManifest.engines,
      }),
      [],
    );
  });

  test("root manifest declares only the approved toolchain dev dependencies", () => {
    for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
      assert.equal(rootManifest[field] ?? undefined, undefined, field);
    }
    assert.equal(rootManifest.devDependencies?.typescript, "6.0.3");
    const allowed = [
      "@eslint/js",
      "eslint",
      "eslint-config-prettier",
      "globals",
      "prettier",
      "typescript",
      "typescript-eslint",
    ];
    assert.deepEqual(Object.keys(rootManifest.devDependencies ?? {}).sort(), allowed);
  });
});

describe("negative fixtures (pure, isolated from repository files)", () => {
  test("rejects a duplicate workspace name", () => {
    const dupes = findDuplicateNames([{ name: "@deazly/ui" }, { name: "@deazly/ui" }]);
    assert.deepEqual(dupes, ["@deazly/ui"]);
  });

  test("rejects a public (non-private) manifest", () => {
    const problems = validateWorkspaceManifest({ name: "@deazly/ui", version: "0.0.0", private: false }, "@deazly/ui");
    assert.ok(problems.includes("private must be true"));
  });

  test("rejects a manifest with a third-party dependency", () => {
    const problems = validateWorkspaceManifest(
      { name: "@deazly/ui", version: "0.0.0", private: true, dependencies: { react: "19.0.0" } },
      "@deazly/ui",
    );
    assert.ok(problems.includes("must not declare dependencies"));
  });

  test("rejects a manifest with an install lifecycle hook", () => {
    const problems = validateWorkspaceManifest(
      { name: "@deazly/ui", version: "0.0.0", private: true, scripts: { postinstall: "node x.js" } },
      "@deazly/ui",
    );
    assert.ok(problems.includes("must not define postinstall"));
  });

  test("detects missing and extra workspaces", () => {
    const expected = ["apps/api", "apps/admin"];

    const withExtra = compareWorkspaceSet(["apps/api", "apps/admin", "apps/legacy"], expected);
    assert.equal(withExtra.ok, false);
    assert.deepEqual(withExtra.extra, ["apps/legacy"]);
    assert.deepEqual(withExtra.missing, []);

    const withMissing = compareWorkspaceSet(["apps/api"], expected);
    assert.equal(withMissing.ok, false);
    assert.deepEqual(withMissing.missing, ["apps/admin"]);
    assert.deepEqual(withMissing.extra, []);
  });

  test("rejects mismatched toolchain pins", () => {
    const problems = validatePins({
      nodeVersion: "22.22.2",
      packageManager: "pnpm@11.25.0",
      engines: { node: "22.22.2", pnpm: "11.25.0" },
    });
    assert.equal(problems.length, 4);
  });
});
