export type DocsNavItem = {
  to: string
  i18n: string
} & ({ label: string; labelI18n?: never } | { label?: never; labelI18n: string })

export interface DocsNavGroup {
  label: string
  items: DocsNavItem[]
}

export interface DocsCategory {
  slug: string
}

export type DocsComponent = DocsNavItem & {
  category: string
}

export interface DocsPrimaryItem {
  label: string
  to: string
  match: string
}

export const categories: DocsCategory[] = [
  { slug: 'foundation' },
  { slug: 'typography' },
  { slug: 'layout' },
  { slug: 'atoms' },
  { slug: 'forms' },
  { slug: 'overlays' },
  { slug: 'display' },
  { slug: 'data' },
  { slug: 'navigation' },
  { slug: 'shell' },
]

export const guides: DocsNavItem[] = [
  { labelI18n: 'nav.installation', to: '/guide/installation', i18n: 'guides.installation' },
]

export const components: DocsComponent[] = [
  {
    label: 'Accordion',
    to: '/components/accordion',
    i18n: 'components.accordion',
    category: 'display',
  },
  { label: 'Alert', to: '/components/alert', i18n: 'components.alert', category: 'display' },
  {
    label: 'AlertDialog',
    to: '/components/alert-dialog',
    i18n: 'components.alert-dialog',
    category: 'overlays',
  },
  { label: 'Anchor', to: '/components/anchor', i18n: 'components.anchor', category: 'navigation' },
  {
    label: 'AppShell',
    to: '/components/app-shell',
    i18n: 'components.app-shell',
    category: 'shell',
  },
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
  {
    label: 'Breadcrumb',
    to: '/components/breadcrumb',
    i18n: 'components.breadcrumb',
    category: 'navigation',
  },
  { label: 'Button', to: '/components/button', i18n: 'components.button', category: 'atoms' },
  {
    label: 'ButtonGroup',
    to: '/components/button-group',
    i18n: 'components.button-group',
    category: 'atoms',
  },
  {
    label: 'Calendar',
    to: '/components/calendar',
    i18n: 'components.calendar',
    category: 'display',
  },
  { label: 'Callout', to: '/components/callout', i18n: 'components.callout', category: 'display' },
  { label: 'Card', to: '/components/card', i18n: 'components.card', category: 'display' },
  { label: 'Center', to: '/components/center', i18n: 'components.center', category: 'layout' },
  { label: 'Checkbox', to: '/components/checkbox', i18n: 'components.checkbox', category: 'forms' },
  {
    label: 'CheckboxGroup',
    to: '/components/checkbox-group',
    i18n: 'components.checkbox-group',
    category: 'forms',
  },
  { label: 'Chip', to: '/components/chip', i18n: 'components.chip', category: 'atoms' },
  {
    label: 'CloseButton',
    to: '/components/close-button',
    i18n: 'components.close-button',
    category: 'atoms',
  },
  { label: 'Code', to: '/components/code', i18n: 'components.code', category: 'typography' },
  {
    label: 'CodeBlock',
    to: '/components/code-block',
    i18n: 'components.code-block',
    category: 'typography',
  },
  {
    label: 'Collapsible',
    to: '/components/collapsible',
    i18n: 'components.collapsible',
    category: 'display',
  },
  {
    label: 'Combobox',
    to: '/components/combobox',
    i18n: 'components.combobox',
    category: 'forms',
  },
  {
    label: 'CommandPalette',
    to: '/components/command-palette',
    i18n: 'components.command-palette',
    category: 'overlays',
  },
  {
    label: 'Container',
    to: '/components/container',
    i18n: 'components.container',
    category: 'layout',
  },
  {
    label: 'ContextMenu',
    to: '/components/context-menu',
    i18n: 'components.context-menu',
    category: 'overlays',
  },
  {
    label: 'CopyButton',
    to: '/components/copy-button',
    i18n: 'components.copy-button',
    category: 'atoms',
  },
  {
    label: 'DateField',
    to: '/components/date-field',
    i18n: 'components.date-field',
    category: 'forms',
  },
  {
    label: 'DatePicker',
    to: '/components/date-picker',
    i18n: 'components.date-picker',
    category: 'forms',
  },
  {
    label: 'DateRangeField',
    to: '/components/date-range-field',
    i18n: 'components.date-range-field',
    category: 'forms',
  },
  {
    label: 'DateRangePicker',
    to: '/components/date-range-picker',
    i18n: 'components.date-range-picker',
    category: 'forms',
  },
  {
    label: 'DateTimePicker',
    to: '/components/date-time-picker',
    i18n: 'components.date-time-picker',
    category: 'forms',
  },
  {
    label: 'DescriptionList',
    to: '/components/description-list',
    i18n: 'components.description-list',
    category: 'typography',
  },
  { label: 'Dialog', to: '/components/dialog', i18n: 'components.dialog', category: 'overlays' },
  {
    label: 'DisclosureIcon',
    to: '/components/disclosure-icon',
    i18n: 'components.disclosure-icon',
    category: 'foundation',
  },
  { label: 'Divider', to: '/components/divider', i18n: 'components.divider', category: 'layout' },
  { label: 'Drawer', to: '/components/drawer', i18n: 'components.drawer', category: 'overlays' },
  {
    label: 'DropdownMenu',
    to: '/components/dropdown-menu',
    i18n: 'components.dropdown-menu',
    category: 'overlays',
  },
  { label: 'Empty', to: '/components/empty', i18n: 'components.empty', category: 'display' },
  {
    label: 'FileUpload',
    to: '/components/file-upload',
    i18n: 'components.file-upload',
    category: 'forms',
  },
  { label: 'Flex', to: '/components/flex', i18n: 'components.flex', category: 'layout' },
  { label: 'Form', to: '/components/form', i18n: 'components.form', category: 'forms' },
  {
    label: 'FormField',
    to: '/components/form-field',
    i18n: 'components.form-field',
    category: 'forms',
  },
  {
    label: 'FormLayout',
    to: '/components/form-layout',
    i18n: 'components.form-layout',
    category: 'forms',
  },
  { label: 'Grid', to: '/components/grid', i18n: 'components.grid', category: 'layout' },
  {
    label: 'Heading',
    to: '/components/heading',
    i18n: 'components.heading',
    category: 'typography',
  },
  {
    label: 'Highlight',
    to: '/components/highlight',
    i18n: 'components.highlight',
    category: 'foundation',
  },
  {
    label: 'HoverCard',
    to: '/components/hover-card',
    i18n: 'components.hover-card',
    category: 'overlays',
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
  { label: 'Input', to: '/components/input', i18n: 'components.input', category: 'forms' },
  {
    label: 'InputGroup',
    to: '/components/input-group',
    i18n: 'components.input-group',
    category: 'forms',
  },
  { label: 'Kbd', to: '/components/kbd', i18n: 'components.kbd', category: 'typography' },
  { label: 'Link', to: '/components/link', i18n: 'components.link', category: 'typography' },
  { label: 'List', to: '/components/list', i18n: 'components.list', category: 'typography' },
  { label: 'Listbox', to: '/components/listbox', i18n: 'components.listbox', category: 'forms' },
  {
    label: 'LoadingOverlay',
    to: '/components/loading-overlay',
    i18n: 'components.loading-overlay',
    category: 'overlays',
  },
  { label: 'Mark', to: '/components/mark', i18n: 'components.mark', category: 'typography' },
  {
    label: 'Menubar',
    to: '/components/menubar',
    i18n: 'components.menubar',
    category: 'overlays',
  },
  {
    label: 'MeterGroup',
    to: '/components/meter-group',
    i18n: 'components.meter-group',
    category: 'display',
  },
  {
    label: 'MultiCombobox',
    to: '/components/multi-combobox',
    i18n: 'components.multi-combobox',
    category: 'forms',
  },
  {
    label: 'MultiSelect',
    to: '/components/multi-select',
    i18n: 'components.multi-select',
    category: 'forms',
  },
  {
    label: 'NavLink',
    to: '/components/nav-link',
    i18n: 'components.nav-link',
    category: 'navigation',
  },
  {
    label: 'NumberFormat',
    to: '/components/number-format',
    i18n: 'components.number-format',
    category: 'typography',
  },
  {
    label: 'NumberInput',
    to: '/components/number-input',
    i18n: 'components.number-input',
    category: 'forms',
  },
  { label: 'Page', to: '/components/page', i18n: 'components.page', category: 'shell' },
  { label: 'Panel', to: '/components/panel', i18n: 'components.panel', category: 'display' },
  {
    label: 'PasswordInput',
    to: '/components/password-input',
    i18n: 'components.password-input',
    category: 'forms',
  },
  {
    label: 'PinInput',
    to: '/components/pin-input',
    i18n: 'components.pin-input',
    category: 'forms',
  },
  {
    label: 'Popconfirm',
    to: '/components/popconfirm',
    i18n: 'components.popconfirm',
    category: 'overlays',
  },
  {
    label: 'Popover',
    to: '/components/popover',
    i18n: 'components.popover',
    category: 'overlays',
  },
  {
    label: 'PrevNext',
    to: '/components/prev-next',
    i18n: 'components.prev-next',
    category: 'navigation',
  },
  {
    label: 'Progress',
    to: '/components/progress',
    i18n: 'components.progress',
    category: 'display',
  },
  { label: 'Prose', to: '/components/prose', i18n: 'components.prose', category: 'typography' },
  {
    label: 'RadioGroup',
    to: '/components/radio-group',
    i18n: 'components.radio-group',
    category: 'forms',
  },
  {
    label: 'RangeCalendar',
    to: '/components/range-calendar',
    i18n: 'components.range-calendar',
    category: 'display',
  },
  {
    label: 'RangeSlider',
    to: '/components/range-slider',
    i18n: 'components.range-slider',
    category: 'forms',
  },
  { label: 'Rating', to: '/components/rating', i18n: 'components.rating', category: 'forms' },
  { label: 'Result', to: '/components/result', i18n: 'components.result', category: 'display' },
  {
    label: 'RingProgress',
    to: '/components/ring-progress',
    i18n: 'components.ring-progress',
    category: 'display',
  },
  { label: 'Ripple', to: '/components/ripple', i18n: 'components.ripple', category: 'foundation' },
  {
    label: 'ScrollArea',
    to: '/components/scroll-area',
    i18n: 'components.scroll-area',
    category: 'layout',
  },
  {
    label: 'SearchInput',
    to: '/components/search-input',
    i18n: 'components.search-input',
    category: 'forms',
  },
  { label: 'Section', to: '/components/section', i18n: 'components.section', category: 'shell' },
  {
    label: 'SegmentedControl',
    to: '/components/segmented-control',
    i18n: 'components.segmented-control',
    category: 'forms',
  },
  { label: 'Select', to: '/components/select', i18n: 'components.select', category: 'forms' },
  { label: 'Sheet', to: '/components/sheet', i18n: 'components.sheet', category: 'overlays' },
  { label: 'Sidebar', to: '/components/sidebar', i18n: 'components.sidebar', category: 'shell' },
  {
    label: 'SimpleGrid',
    to: '/components/simple-grid',
    i18n: 'components.simple-grid',
    category: 'layout',
  },
  {
    label: 'Skeleton',
    to: '/components/skeleton',
    i18n: 'components.skeleton',
    category: 'atoms',
  },
  { label: 'Slider', to: '/components/slider', i18n: 'components.slider', category: 'forms' },
  { label: 'Space', to: '/components/space', i18n: 'components.space', category: 'layout' },
  { label: 'Spinner', to: '/components/spinner', i18n: 'components.spinner', category: 'atoms' },
  {
    label: 'Splitter',
    to: '/components/splitter',
    i18n: 'components.splitter',
    category: 'layout',
  },
  {
    label: 'Spoiler',
    to: '/components/spoiler',
    i18n: 'components.spoiler',
    category: 'typography',
  },
  { label: 'Stack', to: '/components/stack', i18n: 'components.stack', category: 'layout' },
  { label: 'Switch', to: '/components/switch', i18n: 'components.switch', category: 'forms' },
  { label: 'Table', to: '/components/table', i18n: 'components.table', category: 'data' },
  { label: 'Tabs', to: '/components/tabs', i18n: 'components.tabs', category: 'display' },
  { label: 'Tag', to: '/components/tag', i18n: 'components.tag', category: 'atoms' },
  {
    label: 'TagsInput',
    to: '/components/tags-input',
    i18n: 'components.tags-input',
    category: 'forms',
  },
  { label: 'Text', to: '/components/text', i18n: 'components.text', category: 'typography' },
  {
    label: 'Textarea',
    to: '/components/textarea',
    i18n: 'components.textarea',
    category: 'forms',
  },
  { label: 'Time', to: '/components/time', i18n: 'components.time', category: 'typography' },
  {
    label: 'TimeField',
    to: '/components/time-field',
    i18n: 'components.time-field',
    category: 'forms',
  },
  { label: 'Toast', to: '/components/toast', i18n: 'components.toast', category: 'overlays' },
  { label: 'Toggle', to: '/components/toggle', i18n: 'components.toggle', category: 'forms' },
  {
    label: 'Tooltip',
    to: '/components/tooltip',
    i18n: 'components.tooltip',
    category: 'overlays',
  },
  {
    label: 'TreeSelect',
    to: '/components/tree-select',
    i18n: 'components.tree-select',
    category: 'forms',
  },
  {
    label: 'VisuallyHidden',
    to: '/components/visually-hidden',
    i18n: 'components.visually-hidden',
    category: 'foundation',
  },
]

export const nav: { label: string; items: DocsNavItem[] }[] = [
  { label: 'nav.start', items: guides },
  { label: 'nav.components', items: components },
]

export const primary: DocsPrimaryItem[] = [
  { label: 'nav.primaryStart', to: '/guide/installation', match: '/guide' },
  { label: 'nav.primaryComponents', to: '/components', match: '/components' },
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
