# Release notes

- Create release records with `pnpm change:add <type> <scope> "<note>" [patch|minor|major]`. Do not handwrite new `.changes/*.md` files or edit the generated package changelog directly.
- Run `pnpm change:add --help` for the types defined by `release.config.json`. New capabilities use `added`, not the commit-message type `feat`. Do not use `pnpm change`: pnpm 11 reserves it for its built-in changeset workflow.
- Write release notes in English. Documentation, tests and release tooling alone do not need a component release record.
- Before committing, run `pnpm release:check`. It validates both the release tooling and the repository's actual change records.
- Use `pnpm release:preview` to inspect the next release without changing files. Version bumps remain independent of changelog categories; do not request a minor release solely because a capability was added.
