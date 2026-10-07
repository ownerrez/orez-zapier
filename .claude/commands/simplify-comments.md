---
description: Audit added/modified comments against the AGENTS.md comment rules — fix in place, or report-only with --check
argument-hint: [--check] [--base <branch>]
---

# /simplify-comments

Review every comment added or modified in the current diff against `AGENTS.md` § Code Comments and § Writing Style. Do not relist the rules here — read them from the source.

## Modes

- **Default (fix):** edit or delete comments in place.
- **`--check`:** report findings only; edit nothing.
- **`--base <branch>`:** diff from `origin/<branch>` instead of `main`.

## Workflow

1. Base: `git merge-base HEAD origin/<branch>` with `--base`, otherwise `git merge-base HEAD main`.
2. Collect added/modified comment lines from `git diff <base>...HEAD`, `git diff`, and `git diff --staged`. Pre-existing comments are out of scope.
3. Judge each comment. **Deletion is the default verdict, not rewording.**
   - Over 2 lines, or longer than the code it documents → delete, or reword to one line only when it states a business rule, external API constraint, or non-obvious algorithm.
   - Contains a banned filler phrase → delete; keep at most a one-line hard fact.
   - Argues instead of states (defends the implementation against an alternative) → rewrite to the one fact a maintainer needs, or delete. Exempt when the alternative is the fact: `// Zapier sorts them alphabetically by key` states a constraint.
   - Names an actor or the other end of a coupling with a stand-in ("that path", "elsewhere", "mirrors the stamp") → name the function or file, or drop the clause.
   - Names an internal label (run name, version tag, experiment id) that resolves nowhere in the repo → delete the label, keep the fact.
4. Accuracy: a surviving comment that claims behavior ("prevents X", "fires when Y") → read the code path and confirm. A refuted claim is the highest-severity finding: correct or delete it.
5. Report each change as `file:line — <removed text or before→after> — <rule violated>`, grouped by file. If nothing needed correcting, say so.

User-facing strings (`label`, `helpText`, `display.description`) are not comments and are out of scope. Commit messages and PR descriptions are out of scope.
