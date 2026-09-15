# 变更记录与发布

Hina UI 使用仓库内的发布脚本管理 `@hina-ui/vue`。更新记录的分类与版本升级幅度分别决定；日常发布默认升 patch，minor 和 major 显式选择。这是项目的版本策略，新增公共 API 也可以进入 patch，不声称严格遵循 SemVer 的升级分类。

## 记录变更

```bash
pnpm change fixed Image "修复加载前后的尺寸跳变。"
pnpm change added Dialog "增加标题插槽。"
pnpm change changed DataTable "优化列宽调整的反馈。"
```

每个独立改动附一份 `.changes/*.md`，和代码一起提交。文档、测试和发布工具本身的修改无需新增组件发布记录。

```md
---
type: added
scope: Dialog
---

增加标题插槽。
```

`type` 支持 `added`、`changed`、`deprecated`、`removed`、`fixed`、`security`，依次生成“新增、优化、已弃用、移除、修复、安全”分类。`scope` 填组件或能力名称，正文描述最终变化。

需要指定最低升级级别时，在命令末尾加 `minor` 或 `major`，文件中对应 `level` 字段。多个记录取最高级别；发布时不能用更低的级别或版本覆盖它。不兼容的公共 API 修改必须声明 `level: major`，并写清迁移方式。

## 本地预览

```bash
pnpm release:preview
pnpm release:preview --bump=minor
pnpm release:preview --version=1.9.0
pnpm release:check
```

预览只读取文件，不修改版本、记录或 Git。指定版本必须是递增的 `X.Y.Z` 稳定版本，并满足记录的最低升级要求。没有记录时不生成版本；不会仅因为提交消息包含 `feat` 就升 minor。

`pnpm release:prepare` 将预览结果写入 `packages/vue/package.json` 和 `packages/vue/CHANGELOG.md`，消费对应记录，供需要本地准备发布 PR 时使用。它不会提交、推送或发布 npm。已有 Changelog 保留原样。

## 自动发布

1. `main` 有新推送时，Release 工作流更新 `release/next` 发布 PR，列出版本和更新记录。默认升 patch，例如 `1.7.0 → 1.7.1`。
2. 要选择 minor、major 或准确版本，在 Actions 的 Release 工作流中选择 `main`，填写 `bump` 或 `version` 后运行。`auto` 会保留同一轮发布 PR 已选定的较高版本；显式选择可以重新调整，但不能低于记录要求。
3. 发布 PR 由 `GITHUB_TOKEN` 创建，脚本会主动触发它的 CI。无须额外的个人访问令牌。
4. 合并发布 PR 后，等待 `main` 上这个提交的 CI 通过，再构建并发布 npm、创建版本 Tag 和 GitHub Release。只处理实际修改包版本的提交，普通推送不重复发包。

工作流保留 `release.yml` 文件名和 `npm` environment，沿用 npm 的 GitHub Actions trusted publisher / OIDC 配置。仓库需要允许 GitHub Actions 创建 PR；准备任务使用 `contents: write`、`pull-requests: write` 和 `actions: write`，发布任务使用 `contents: write`、`actions: read` 和 `id-token: write`。

自动化只更新 `release/next`，推送带 `--force-with-lease`；`main` 在准备过程中前进时会停止，使用最新提交的工作流重新准备即可。

## 失败重试

CI 失败不会发布。偶发失败可以重跑该提交的 CI；如果必须修改代码或测试，应在修复后重新准备下一次发布 PR。后续普通提交不会代替旧发布提交发布同一个版本。

npm 或 GitHub 发布失败时，重新运行原来失败的 Release 工作流，仍使用原提交；不要为了重试再升一次版本。脚本会校验 npm 已有版本的 `gitHead` 和 Tag 所指提交，已完成的步骤会跳过。npm 已成功、GitHub Release 失败时只补建 Tag / Release。网络或权限错误会明确失败，不会当成“尚未发布”。

版本与提交不一致、版本回退，或当前提交的最新 CI 未通过时，发布会停止。已经发布的版本不覆盖。
