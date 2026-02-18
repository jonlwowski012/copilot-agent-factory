---
name: shareable-packages-template
description: "Make Python or TypeScript packages shareable (pip/npm). Auto-activates when preparing packages for publish or automating packaging."
auto-activates:
  - "make packages shareable"
  - "shareable package"
  - "prepare for pip publish"
  - "prepare for npm publish"
  - "automate packaging"
  - "publish to PyPI"
  - "publish to npm"
  - "installable package"
  - "portable package"
---

# Skill: Shareable Packages Template (Python & TypeScript)

Portable workflow for making a codebase installable and publishable. **Detect the project language first**, then follow the matching section.

---

## 1. Detect project type

- **Python**: presence of `pyproject.toml`, `setup.py`, `setup.cfg`, or `requirements*.txt` at repo root.
- **TypeScript/JavaScript**: presence of `package.json` at repo root (and optionally `tsconfig.json`).

If both exist, ask the user which package(s) they want to make shareable, or apply the relevant section per directory (e.g. a monorepo with `packages/python` and `packages/ts`).

---

## 2. Python: Shareable package checklist

### 2.1 Build and metadata

- **A1** Ensure build is declared in `pyproject.toml` (PEP 517/518):
  - `[build-system]` with `build-backend = "setuptools.build_meta"` (or `hatchling`, `flit`).
  - `[project]` with `name`, `version`, `description`, `readme`, `requires-python`, `dependencies`.
- **A2** If the project still uses only `setup.py`, move metadata and `install_requires` into `pyproject.toml`; keep a minimal `setup.py` only if needed for editable installs.
- **A3** Set `packages` (or `[tool.setuptools.packages.find]`) so all installable packages are included; exclude `test*`, `docs*`, etc.

### 2.2 Installability

- **B1** Imports must be package-relative (e.g. `from mypackage.module import foo`). No reliance on repo root in `sys.path` for production code.
- **B2** Optional: use `src/` layout (`src/<package_name>/`) for a cleaner install.
- **B3** Verify: in a **new venv**, run `pip install -e .` then run the project's test command (e.g. `pytest tests/ -q`). No `PYTHONPATH` hacks.

### 2.3 Version and artifacts

- **C1** Single source of truth for version: `version` in `pyproject.toml` or a `version.py` read by it.
- **C2** Build artifacts: `pip install build && python -m build` → `dist/*.whl` and `dist/*.tar.gz`.

### 2.4 Publish (document only; do not run without explicit ask)

- **D1** Document: PyPI (public) or private index (CodeArtifact, Nexus, etc.). Consumer install: `pip install <package-name>` or `pip install --index-url ... <package-name>`.

### 2.5 Scripts (agent may add)

- **`scripts/ensure_shareable.sh`**: create temp venv, `pip install -e .`, run tests (e.g. `pytest tests/ -q`); exit 0 only if all pass.
- **`scripts/build.sh`**: install `build`, run `python -m build`, list `dist/`. No upload.

---

## 3. TypeScript/JavaScript: Shareable package checklist

### 3.1 Build and metadata

- **A1** Ensure `package.json` has: `name`, `version`, `description`, `main` (and/or `module`, `types`), `files` (e.g. `["dist", "src"]`), `scripts.build`.
- **A2** For TypeScript: `tsconfig.json` with correct `outDir` (e.g. `dist/`); build produces output that `main`/`module`/`types` point to.
- **A3** Prefer **publishable** package name (e.g. scoped `@org/package-name` for private npm or org-scoped publish).

### 3.2 Installability

- **B1** Entry points: `main` (CJS), `module` (ESM), `types` (TypeScript) must resolve to built files (e.g. `dist/index.js`, `dist/index.d.ts`).
- **B2** No reliance on repo root for resolution in published code; use package-relative imports; bundling or path aliases must work from `node_modules`.
- **B3** Verify: in a **new directory**, run `npm pack` (or `pnpm pack`), then `npm install ./<package>-*.tgz` in another folder and `require()` or `import` the package; run the library's tests if present.

### 3.3 Version and artifacts

- **C1** Single source of truth for version: `version` in `package.json` (or tool that writes it, e.g. from git tag).
- **C2** Build artifacts: `npm run build` (or `pnpm build`); then `npm pack` → `<name>-<version>.tgz`. Optionally prepare for `npm publish --dry-run`.

### 3.4 Publish (document only; do not run without explicit ask)

- **D1** Document: npm (public or scoped) or private registry (npm Enterprise, Verdaccio, GitHub Packages, etc.). Consumer: `npm install <package-name>` or `npm install --registry=... <package-name>`.

### 3.5 Scripts (agent may add)

- **`scripts/ensure_shareable.sh`**: in temp dir, `npm pack` from project, install the tarball elsewhere, run consumer smoke test or the project's test script.
- **`scripts/build.sh`**: `npm run build` (or `pnpm build`), then `npm pack`; list the generated `.tgz`. No publish.

---

## 4. Shared rules (Python and TypeScript)

- **Do not** publish to a real registry (PyPI, npm, etc.) unless the user explicitly asks.
- **Do not** bump version or create git tags unless the user asks.
- **Do not** split the repo into multiple packages unless the user asks.
- After edits, run the project's test command and fix any failures before reporting success.

---

## 5. Quick reference

| Goal           | Python | TypeScript |
|----------------|--------|------------|
| Build config   | `pyproject.toml` [build-system] + [project] | `package.json` name, version, main/module/types, files |
| Install local  | `pip install -e .` | `npm link` or `npm install /path/to/tarball.tgz` |
| Build artifacts| `python -m build` → dist/ | `npm run build` then `npm pack` → .tgz |
| Verify shareable | New venv, `pip install -e .`, run tests | New dir, install from `npm pack`, run tests |
| Publish        | Document only; use twine/CI when asked | Document only; use npm publish when asked |

---

## 6. Optional: Project-specific plan doc

For larger repos, the agent can create or update a **plan document** (e.g. `docs/shareable_packages_plan.md`) that:

- Repeats the relevant checklist (Python and/or TS) for this repo.
- Adds project-specific paths (e.g. test command, package name).
- References this skill so future agents follow the same workflow.

Use the same checklist order (A → B → C → D) and "do not publish/bump/split unless asked" rules.
