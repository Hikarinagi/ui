import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cache } from 'react'

export const openAiSvg = cache(() =>
  readFile(
    join(process.cwd(), 'node_modules', '@lobehub', 'icons-static-svg', 'icons', 'openai.svg'),
    'utf8',
  ),
)
