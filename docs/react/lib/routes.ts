export type Locale = 'zh-CN' | 'en'

export function localeFromSlug(slug: string[] = []): { locale: Locale; path: string } {
  const [first, ...rest] = slug
  if (first === 'en') return { locale: 'en', path: rest.join('/') }
  return { locale: 'zh-CN', path: slug.join('/') }
}

export function hrefFor(locale: Locale, path: string) {
  const clean = path.replace(/^\/+/, '')
  if (locale === 'en') return clean ? `/en/${clean}` : '/en'
  return clean ? `/${clean}` : '/'
}
