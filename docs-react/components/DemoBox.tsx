import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ComponentType } from 'react'
import { Card, Text } from '@hina-ui/react'
import type { Locale } from '~/lib/content'
import { highlight } from '~/lib/highlight'
import { translator } from '~/lib/i18n'
import { DemoFrame } from './DemoFrame'

export async function DemoBox({
  name,
  locale,
  Demo,
}: {
  name: string
  locale: Locale
  Demo?: ComponentType
}) {
  const id = `${locale}/${name}`
  if (!Demo)
    return (
      <Card>
        <Text tone="muted">{locale === 'en' ? `Demo pending: ${name}` : `示例待补:${name}`}</Text>
      </Card>
    )
  const t = translator(locale)
  const source = await readFile(join(process.cwd(), 'demos', `${id}.tsx`), 'utf8')
  return (
    <DemoFrame
      code={source}
      lang="tsx"
      html={await highlight(source, 'tsx')}
      expandLabel={t('actions.expandCode')}
      collapseLabel={t('actions.collapseCode')}
    >
      <Demo />
    </DemoFrame>
  )
}
