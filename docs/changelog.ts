const repository = 'https://github.com/Hikarinagi/ui'
const versionHeading = /^## (?:\[([^\]]+)\]\(([^)]+)\)|(\S+))(?: \(([^)]+)\))?$/gm

export function renderChangelog(source: string): string {
  return source
    .replace(/^# [^\n]+\r?\n/, '')
    .replace(
      versionHeading,
      (_heading, linked: string, compare: string, plain: string, date: string) => {
        const version = linked ?? plain
        const tag = encodeURIComponent(`@hina-ui/vue@${version}`)
        const links = [
          date,
          `[Release](${repository}/releases/tag/${tag})`,
          compare ? `[Compare](${compare})` : undefined,
        ].filter(Boolean)
        return `## ${version} {#v${version.replaceAll('.', '-')}}\n\n${links.join(' · ')}`
      },
    )
    .replace(
      /^- ([a-f\d]{7,40}): /gm,
      (_match, sha: string) => `- [${sha}](${repository}/commit/${sha}): `,
    )
    .trim()
}

export function expandChangelog(source: string, changelog: string): string {
  return source.replace('<Changelog />', () => renderChangelog(changelog))
}
