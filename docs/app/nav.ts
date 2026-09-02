export interface DocsNavItem {
  label?: string
  labelI18n?: string
  to: string
  i18n: string
}

export interface DocsNavGroup {
  label: string
  items: DocsNavItem[]
}

export interface DocsCategory {
  slug: string
}

export interface DocsComponent extends DocsNavItem {
  category: string
}

export interface DocsPrimaryItem {
  label: string
  to: string
  match: string
}

export const categories: DocsCategory[] = [
  { slug: 'typography' },
  { slug: 'layout' },
  { slug: 'atoms' },
  { slug: 'overlays' },
]

export const guides: DocsNavItem[] = [
  { labelI18n: 'nav.installation', to: '/guide/installation', i18n: 'guides.installation' },
]

export const components: DocsComponent[] = [
  {
    label: 'AspectRatio',
    to: '/components/aspect-ratio',
    i18n: 'components.aspect-ratio',
    category: 'layout',
  },
  { label: 'Avatar', to: '/components/avatar', i18n: 'components.avatar', category: 'atoms' },
  { label: 'Badge', to: '/components/badge', i18n: 'components.badge', category: 'atoms' },
  {
    label: 'Blockquote',
    to: '/components/blockquote',
    i18n: 'components.blockquote',
    category: 'typography',
  },
  { label: 'Button', to: '/components/button', i18n: 'components.button', category: 'atoms' },
  {
    label: 'ButtonGroup',
    to: '/components/button-group',
    i18n: 'components.button-group',
    category: 'atoms',
  },
  {
    label: 'CloseButton',
    to: '/components/close-button',
    i18n: 'components.close-button',
    category: 'atoms',
  },
  { label: 'Center', to: '/components/center', i18n: 'components.center', category: 'layout' },
  { label: 'Code', to: '/components/code', i18n: 'components.code', category: 'typography' },
  {
  { label: 'Chip', to: '/components/chip', i18n: 'components.chip', category: 'atoms' },
    label: 'CodeBlock',
    to: '/components/code-block',
    i18n: 'components.code-block',
    category: 'typography',
  },
  {
    label: 'Container',
    to: '/components/container',
    i18n: 'components.container',
    category: 'layout',
  },
  {
    label: 'CopyButton',
    to: '/components/copy-button',
    i18n: 'components.copy-button',
    category: 'atoms',
  },
  {
    label: 'DescriptionList',
    to: '/components/description-list',
    i18n: 'components.description-list',
    category: 'typography',
  },
  { label: 'Dialog', to: '/components/dialog', i18n: 'components.dialog', category: 'overlays' },
  { label: 'Divider', to: '/components/divider', i18n: 'components.divider', category: 'layout' },
  { label: 'Drawer', to: '/components/drawer', i18n: 'components.drawer', category: 'overlays' },
  {
    label: 'DropdownMenu',
    to: '/components/dropdown-menu',
    i18n: 'components.dropdown-menu',
    category: 'overlays',
  },
  { label: 'Flex', to: '/components/flex', i18n: 'components.flex', category: 'layout' },
  { label: 'Grid', to: '/components/grid', i18n: 'components.grid', category: 'layout' },
  {
    label: 'Heading',
    to: '/components/heading',
    i18n: 'components.heading',
    category: 'typography',
  },
  {
    label: 'IconButton',
    to: '/components/icon-button',
    i18n: 'components.icon-button',
    category: 'atoms',
  },
  { label: 'Image', to: '/components/image', i18n: 'components.image', category: 'display' },
  {
    label: 'Indicator',
    to: '/components/indicator',
    i18n: 'components.indicator',
    category: 'atoms',
  },
  { label: 'Inline', to: '/components/inline', i18n: 'components.inline', category: 'layout' },
  { label: 'Kbd', to: '/components/kbd', i18n: 'components.kbd', category: 'typography' },
  { label: 'Link', to: '/components/link', i18n: 'components.link', category: 'typography' },
  { label: 'List', to: '/components/list', i18n: 'components.list', category: 'typography' },
  { label: 'Mark', to: '/components/mark', i18n: 'components.mark', category: 'typography' },
  {
    label: 'NumberFormat',
    to: '/components/number-format',
    i18n: 'components.number-format',
    category: 'typography',
  },
  {
    label: 'Popover',
    to: '/components/popover',
    i18n: 'components.popover',
    category: 'overlays',
  },
  { label: 'Prose', to: '/components/prose', i18n: 'components.prose', category: 'typography' },
  {
    label: 'ScrollArea',
    to: '/components/scroll-area',
    i18n: 'components.scroll-area',
    category: 'layout',
  },
  {
    label: 'Skeleton',
    to: '/components/skeleton',
    i18n: 'components.skeleton',
    category: 'atoms',
  },
  {
    label: 'SimpleGrid',
    to: '/components/simple-grid',
    i18n: 'components.simple-grid',
    category: 'layout',
  },
  { label: 'Space', to: '/components/space', i18n: 'components.space', category: 'layout' },
  {
    label: 'Spoiler',
    to: '/components/spoiler',
    i18n: 'components.spoiler',
    category: 'typography',
  },
  { label: 'Stack', to: '/components/stack', i18n: 'components.stack', category: 'layout' },
  { label: 'Tag', to: '/components/tag', i18n: 'components.tag', category: 'atoms' },
  { label: 'Text', to: '/components/text', i18n: 'components.text', category: 'typography' },
  { label: 'Time', to: '/components/time', i18n: 'components.time', category: 'typography' },
  { label: 'Toast', to: '/components/toast', i18n: 'components.toast', category: 'overlays' },
  {
    label: 'Tooltip',
    to: '/components/tooltip',
    i18n: 'components.tooltip',
    category: 'overlays',
  },
]

export const nav: { label: string; items: DocsNavItem[] }[] = [
  { label: 'nav.start', items: guides },
  { label: 'nav.components', items: components },
]

export const primary: DocsPrimaryItem[] = [
  { label: 'nav.primaryStart', to: '/guide/installation', match: '/guide' },
  { label: 'nav.primaryComponents', to: '/components/button', match: '/components' },
]

export const pages = nav.flatMap(group =>
  group.items.map(item => ({ ...item, group: group.label })),
)

export function categoryOf(path: string): DocsCategory | undefined {
  const component = components.find(item => path.endsWith(item.to))
  return categories.find(category => category.slug === component?.category)
}

export function categoryPath(slug: string) {
  return `/components/${slug}`
}
