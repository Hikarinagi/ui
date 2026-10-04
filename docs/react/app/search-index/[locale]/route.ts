import { pagesOf } from '../../../../shared/search-index'
import { reactSource } from '~/lib/api'
import { contentRoot } from '~/lib/content'
import type { Locale } from '~/lib/routes'

const LOCALES: Locale[] = ['zh-CN', 'en']

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale
  return Response.json(
    await pagesOf(locale, contentRoot, (source, route) =>
      reactSource(source, locale, route.replace(/^\//, '')),
    ),
  )
}
