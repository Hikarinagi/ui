import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { expandChangelog } from '../../docs/changelog'

export const changelogPath = join(process.cwd(), '..', 'packages', 'vue', 'CHANGELOG.md')

export async function loadChangelog(source: string) {
  if (!source.includes('<Changelog />')) return source
  return expandChangelog(source, await readFile(changelogPath, 'utf8'))
}
