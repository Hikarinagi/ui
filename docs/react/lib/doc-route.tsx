import 'server-only'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CopyMarkdown } from '~/components/CopyMarkdown'
import { DocPage } from '~/components/DocPage'
import { openAiSvg } from '~/lib/brands'
import type { PageModules } from '~/lib/demo-map'
import { loadDoc } from '~/lib/content'
import { renderMarkdown, toc } from '~/lib/markdown'
import type { Locale } from '~/lib/routes'

export async function docMetadata(locale: Locale, path: string): Promise<Metadata> {
  if (!path) return {}
  const doc = await loadDoc(locale, path)
  return doc
    ? {
        title: { absolute: `${doc.frontmatter.title} · Hina UI for React` },
        description: doc.frontmatter.description,
      }
    : {}
}

export async function DocRoute({
  locale,
  path,
  modules,
}: {
  locale: Locale
  path: string
  modules: PageModules
}) {
  const doc = await loadDoc(locale, path)
  if (!doc) notFound()
  const { content, headings } = await renderMarkdown(doc.body, locale, path, modules, doc.api)
  return (
    <DocPage
      locale={locale}
      path={path}
      title={doc.frontmatter.title}
      description={doc.frontmatter.description}
      toc={toc(headings, doc.frontmatter.tocDepth ?? 3)}
      links={doc.frontmatter.links}
      actions={
        <CopyMarkdown locale={locale} title={doc.frontmatter.title} openAiSvg={await openAiSvg()} />
      }
    >
      {content}
    </DocPage>
  )
}
