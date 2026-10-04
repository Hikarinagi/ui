export interface DocLink {
  label: string
  href: string
}

export function reactHref(href: string): string | undefined {
  if (/^https:\/\/reka-ui\.com\//.test(href)) return undefined
  return href
    .replace(/\/packages\/vue\/src\/(.+)\.vue$/, '/packages/react/src/$1.tsx')
    .replace(/\/packages\/vue\/src\/(index\.ts|styles\/tokens\.css)$/, '/packages/react/src/$1')
    .replace('https://motion.dev/docs/vue-', 'https://motion.dev/docs/react-')
    .replace(
      'https://www.npmjs.com/package/@hina-ui/vue',
      'https://www.npmjs.com/package/@hina-ui/react',
    )
}

export function reactLinks<T extends DocLink>(links: T[] = []): T[] {
  return links.flatMap(link => {
    const href = reactHref(link.href)
    return href ? [{ ...link, href }] : []
  })
}
