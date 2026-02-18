# Shareable package checklist (portable)

Copy this into your repo (e.g. `docs/shareable_packages_checklist.md`) and tick as you go. Use **Python** or **TypeScript** section depending on the project.

---

## Detect project type

- [ ] **Python**: `pyproject.toml` / `setup.py` / `setup.cfg` present
- [ ] **TypeScript/JS**: `package.json` present

---

## Python

- [ ] **A1** `pyproject.toml` has `[build-system]` and `[project]` (name, version, deps)
- [ ] **A2** Metadata and deps moved off `setup.py` if it existed
- [ ] **A3** `packages` or setuptools find configured; tests/docs excluded
- [ ] **B1** Imports are package-relative; no repo-root `sys.path` hacks
- [ ] **B2** (Optional) `src/<package>/` layout
- [ ] **B3** New venv: `pip install -e .` + test command passes
- [ ] **C1** Version in one place (pyproject or version.py)
- [ ] **C2** `python -m build` produces dist/*.whl and sdist
- [ ] **D1** Publish steps documented (PyPI or private index)

---

## TypeScript / JavaScript

- [ ] **A1** `package.json` has name, version, description, main/module/types, files
- [ ] **A2** (TS) `tsconfig.json` outDir matches build output
- [ ] **A3** Package name suitable for publish (e.g. scoped @org/name)
- [ ] **B1** main/module/types point to built files (e.g. dist/)
- [ ] **B2** No repo-root–only resolution in published code
- [ ] **B3** New dir: `npm pack` → install tarball elsewhere → tests pass
- [ ] **C1** Version in package.json (or synced from tag)
- [ ] **C2** `npm run build` then `npm pack` produces .tgz
- [ ] **D1** Publish steps documented (npm or private registry)

---

## Rules (both)

- Do not publish or bump version unless the user asks.
- Do not split into multiple packages unless the user asks.
- After changes, run tests and fix failures.
