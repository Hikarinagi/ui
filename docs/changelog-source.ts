import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { expandChangelog } from './changelog'

export const changelogPath = fileURLToPath(new URL('../packages/vue/CHANGELOG.md', import.meta.url))

export async function loadChangelog(source: string): Promise<string> {
  if (!source.includes('<Changelog />')) return source
  return expandChangelog(source, await readFile(changelogPath, 'utf8'))
}
