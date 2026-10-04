# 变更记录与发布

Hina UI 使用仓库内的发布脚本管理 `@hina-ui/vue` 和 `@hina-ui/react`。`release.config.json` 的 `packages` 列出参与发布的包，它们同步发布：始终使用同一版本号，每次发布一起升级。更新记录的分类与版本升级幅度分别决定；日常发布默认升 patch，minor 和 major 显式选择。这是项目的版本策略，新增公共 API 也可以进入 patch，不声称严格遵循 SemVer 的升级分类。

## 记录变更

```bash
pnpm change:add --help
pnpm change:add fixed Image "Fix image dimensions changing after loading."
pnpm change:add added Dialog "Add a title slot."
pnpm change:add changed DataTable "Improve column resizing feedback."
pnpm change:add fixed FormField "Fix the hint animation." --package vue
pnpm change:add added Dialog "Add a title slot." --package vue --package react
```

每个独立改动使用 `pnpm change:add` 创建一份 `.changes/*.md`，和代码一起提交。不要手写新记录或直接修改生成的 CHANGELOG；命令会校验参数并生成元数据。文档、测试和发布工具本身的修改无需新增组件发布记录。

不要使用 `pnpm change`：pnpm 11 已将其保留为内置 changeset 命令，不会执行仓库的发布脚本。

`type` 支持 `added`、`changed`、`deprecated`、`removed`、`fixed`、`security`，依次生成“Added、Changed、Deprecated、Removed、Fixed、Security”分类。`scope` 填组件或能力名称，正文使用英文描述最终变化。CHANGELOG 与 GitHub Release 的分类标题、条目正文统一使用英文，不在同一份记录中混用语言。

记录默认适用于所有包。只影响部分包时加 `--package <id>`，`id` 取 `release.config.json` 中的 `vue` 或 `react`；可以重复使用，也可以用逗号分隔，例如 `--package vue,react`。文件中对应 `packages: vue` 或 `packages: [vue, react]`。每个包的 CHANGELOG 只收录适用于它的记录；某个包在本次发布中没有记录时，仍会同步升级版本，CHANGELOG 写入“Version bump to stay in lockstep with the other Hina UI packages.”。

新增能力使用 `added`，不是提交消息里的 `feat`。类型、升级级别或必填参数错误时，命令会列出正确用法，不创建文件。

需要指定最低升级级别时，在命令末尾加 `minor` 或 `major`，文件中对应 `level` 字段。多个记录取最高级别，同步作用于所有包，即使记录只适用于其中一个包；发布时不能用更低的级别或版本覆盖它。不兼容的公共 API 修改必须声明 `level: major`，并写清迁移方式。

## 本地预览

```bash
pnpm release:preview
pnpm release:preview --bump=minor
pnpm release:preview --version=1.9.0
pnpm release:check
pnpm test:package
```

预览只读取文件，不修改版本、记录或 Git。指定版本必须是递增的 `X.Y.Z` 稳定版本，并满足记录的最低升级要求。所有包必须是公开包（`package.json` 没有 `private: true`）且当前版本一致，否则预览和准备都会列出不满足的包并停止。没有记录时不生成版本；不会仅因为提交消息包含 `feat` 就升 minor。

提交前运行 `pnpm release:check`。它既测试发版器，也校验仓库当前的全部变更记录；CI 会执行同一检查，阻止非法元数据进入主分支。

`pnpm release:prepare` 将预览结果写入每个包的 `package.json` 和 `CHANGELOG.md`（例如 `packages/vue/` 和 `packages/react/`），消费对应记录，供需要本地准备发布 PR 时使用。它不会提交、推送或发布 npm。已有 Changelog 保留原样；包还没有 CHANGELOG 时以 `# <包名>` 标题新建。版本标题通常链接到与上一版本 Tag 的对比；上一版本 Tag 不存在时（包的首次发布），改为链接到新版本 Tag 的代码树。

`pnpm test:package` 只构建组件库，将 tarball 安装到仓库外的临时项目，验证包导出、类型声明、CSS 编译、客户端打包和 Node SSR。消费项目不使用源码 alias 或工作区依赖。CI 将它作为独立任务执行；发布依赖同一提交包含此任务在内的 CI 全部通过。

## 自动发布

1. `main` 有新推送时，Release 工作流更新 `release/next` 发布 PR，列出版本和每个包的更新记录。默认升 patch，例如 `1.7.0 → 1.7.1`，所有包一起升级。
2. 要选择 minor、major 或准确版本，在 Actions 的 Release 工作流中选择 `main`，填写 `bump` 或 `version` 后运行。`auto` 会保留同一轮发布 PR 已选定的较高版本；显式选择可以重新调整，但不能低于记录要求。
3. 发布 PR 由 `GITHUB_TOKEN` 创建，脚本会主动触发它的 CI。无须额外的个人访问令牌。
4. 合并发布 PR 后，等待 `main` 上这个提交的 CI 通过，再处理版本相对第一父提交发生变化的每个包：构建、在包目录发布 npm、创建 `<包名>@<版本>` Tag，并为每个包创建一个使用该包更新记录的 GitHub Release。所有包都先完成检查，再开始写入；npm 全部发布后才创建 Tag 和 Release。只有 `release.config.json` 中排第一的包（`@hina-ui/vue`）会被标记为 GitHub 的 Latest release。发布提交必须实际修改包版本，且对应本仓库已合并的 `release/next → main` PR；脚本会校验 GitHub 记录的合并提交 SHA。普通推送和分支同步不会触发发包，即使它们相对第一父提交存在版本变化。
5. 包在第一父提交中是私有包、在发布提交中改为公开时，视为首次发布；版本仍须递增、包名不能改变。发布提交改为私有包、改名或版本回退时停止。第一父提交中还不存在的包不会发布。

工作流保留 `release.yml` 文件名和 `npm` environment，沿用 npm 的 GitHub Actions trusted publisher / OIDC 配置。仓库需要允许 GitHub Actions 创建 PR；准备任务使用 `contents: write`、`pull-requests: write` 和 `actions: write`，发布任务使用 `contents: write`、`actions: read`、`pull-requests: read` 和 `id-token: write`。

自动化只更新 `release/next`，推送带 `--force-with-lease`；`main` 在准备过程中前进时会停止，使用最新提交的工作流重新准备即可。

## 失败重试

CI 失败不会发布。偶发失败可以重跑该提交的 CI；如果必须修改代码或测试，应在修复后重新准备下一次发布 PR。后续普通提交不会代替旧发布提交发布同一个版本。

npm 或 GitHub 发布失败时，重新运行原来失败的 Release 工作流，仍使用原提交；不要为了重试再升一次版本。脚本会逐个包校验 npm 已有版本的 `gitHead` 和 Tag 所指提交，已完成的步骤会跳过：重试时只构建和发布 npm 上仍缺少的包，只补建缺少的 Tag / Release。任何一个包的 npm 版本、Tag 或 Release 与当前提交冲突时，所有包都不会写入。网络或权限错误会明确失败，不会当成“尚未发布”。

版本与提交不一致、版本回退，或当前提交的最新 CI 未通过时，发布会停止。已经发布的版本不覆盖。
