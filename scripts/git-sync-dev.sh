#!/usr/bin/env bash
set -euo pipefail

remote="${1:-origin}"
main="${2:-main}"
dev="${3:-dev}"

main_ref="refs/remotes/${remote}/${main}"
dev_ref="refs/remotes/${remote}/${dev}"
remote_dev_ref="refs/heads/${dev}"

echo "syncing ${remote}/${dev} onto ${remote}/${main}"
git fetch "${remote}" \
	"+refs/heads/${main}:${main_ref}" \
	"+refs/heads/${dev}:${dev_ref}"

old_dev="$(git rev-parse "${dev_ref}")"
base="$(git merge-base "${dev_ref}" "${main_ref}")"
current_branch="$(git branch --show-current 2>/dev/null || true)"
local_dev_head=""

if [[ "${current_branch}" == "${dev}" ]]; then
	local_dev_head="$(git rev-parse HEAD)"
fi

# core.hooksPath resolves against each worktree's own root, so the temp worktree
# would run whatever pre-push hook the commit it checked out carries — and by the
# time it pushes, that is main's copy. A push is gated by the hooks you have, not
# by the ones the pushed tree happens to ship, so point it back at this clone.
hooks_path="$(git config --get core.hooksPath || true)"
case "${hooks_path}" in
	'') hooks_path="$(git rev-parse --absolute-git-dir)/hooks" ;;
	/*) ;;
	*) hooks_path="$(git rev-parse --show-toplevel)/${hooks_path}" ;;
esac

# Beside the repo, not in TMPDIR: /tmp is tmpfs here, and pnpm cannot hard-link
# out of a store on another filesystem, so an install in the worktree re-downloads
# all 3k packages instead of linking them.
tmp="$(mktemp -d "$(dirname "$(git rev-parse --show-toplevel)")/.git-sync-dev.XXXXXX")"
rm -rf "${tmp}"
ok=0

cleanup() {
	local status=$?

	if [[ "${ok}" == 1 ]]; then
		git worktree remove -f "${tmp}" >/dev/null 2>&1 || rm -rf "${tmp}"
	else
		echo "sync-dev failed; temp worktree left at ${tmp}" >&2
	fi

	exit "${status}"
}
trap cleanup EXIT INT TERM

git worktree add -q --detach "${tmp}" "${dev_ref}"

(
	cd "${tmp}"

	if [[ "${base}" == "${old_dev}" ]]; then
		git reset --hard -q "${main_ref}"
	else
		git rebase --onto "${main_ref}" "${base}" HEAD
	fi

	new_dev="$(git rev-parse HEAD)"
	echo "new ${dev} head: $(git rev-parse --short HEAD)"

	if [[ "${new_dev}" == "${old_dev}" ]]; then
		echo "${remote}/${dev} already up to date"
	else
		# node_modules is gitignored, so this worktree has none and every pnpm
		# gate in .husky/pre-push fails before it can check anything. Install
		# here rather than letting the hook verify the main clone: what is being
		# pushed is this rebase, and no other tree has ever been in that state.
		echo "installing dependencies so the push gate can run"
		pnpm install --frozen-lockfile --prefer-offline

		git -c core.hooksPath="${hooks_path}" push \
			--force-with-lease="${remote_dev_ref}:${old_dev}" \
			"${remote}" \
			"HEAD:${remote_dev_ref}"
	fi
)

ok=1
git fetch "${remote}" "+refs/heads/${dev}:${dev_ref}" >/dev/null

if [[ "${current_branch}" == "${dev}" ]]; then
	dirty=0
	stash_ref=""

	if [[ -n "$(git status --porcelain)" ]]; then
		dirty=1
		stash_name="sync-dev-autostash-$(date +%Y%m%d%H%M%S)"
		echo "local ${dev} is dirty; autostashing WIP before moving to ${remote}/${dev}"
		git stash push --include-untracked --message "${stash_name}"
		stash_ref="$(git rev-parse refs/stash)"
	fi

	if [[ "${local_dev_head}" != "${old_dev}" ]] &&
		git merge-base --is-ancestor "${old_dev}" "${local_dev_head}" &&
		! git merge-base --is-ancestor "${local_dev_head}" "${dev_ref}"; then
		echo "rebasing local-only ${dev} commits onto ${remote}/${dev}"
		git rebase --onto "${dev_ref}" "${old_dev}" "${dev}"
	elif [[ "$(git rev-parse HEAD)" == "$(git rev-parse "${dev_ref}")" ]]; then
		echo "local ${dev} already points at ${remote}/${dev}; worktree changes left as-is"
	elif [[ "${local_dev_head}" != "${old_dev}" ]] &&
		! git merge-base --is-ancestor "${old_dev}" "${local_dev_head}"; then
		echo "local ${dev} has commits that do not descend from previous ${remote}/${dev}; leaving branch unchanged" >&2
		if [[ "${dirty}" == 1 ]]; then
			git stash pop --index || true
		fi
		exit 1
	else
		git reset --hard "${dev_ref}"
	fi

	if [[ "${dirty}" == 1 ]]; then
		if ! git stash pop --index; then
			if git diff --quiet && git diff --cached --quiet; then
				echo "stash index restore failed; retrying without staged-state restoration"

				if git stash apply "${stash_ref}"; then
					if [[ "$(git rev-parse refs/stash 2>/dev/null || true)" == "${stash_ref}" ]]; then
						git stash drop stash@{0} >/dev/null
					fi
				else
					echo "stash reapply had conflicts; the stash is kept for recovery" >&2
					exit 1
				fi
			else
				echo "stash reapply had conflicts; the stash is kept for recovery" >&2
				exit 1
			fi
		fi
	fi
fi

if git merge-base --is-ancestor "${main_ref}" "${dev_ref}"; then
	echo "${remote}/${main} is ancestor of ${remote}/${dev}"
else
	echo "sync verification failed: ${remote}/${main} is not ancestor of ${remote}/${dev}" >&2
	exit 1
fi
