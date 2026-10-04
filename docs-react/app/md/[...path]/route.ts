import { listDocs, localeFromSlug } from '~/lib/content'
import { rawMarkdown } from '~/lib/raw'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const docs = await listDocs()
  return docs.map(({ locale, path }) => ({
    path: [...(locale === 'en' ? ['en'] : []), ...path.split('/').filter(Boolean)],
  }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { locale, path } = localeFromSlug((await params).path)
  const markdown = await rawMarkdown(locale, path)
  if (markdown === undefined) return new Response('Not found', { status: 404 })
  return new Response(markdown, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
