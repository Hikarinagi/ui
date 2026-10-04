import { Stack, TreeSelect, type TreeSelectNode } from '@hina-ui/react'

const items: TreeSelectNode[] = [
  {
    value: 'jp',
    label: 'Japan',
    children: [
      { value: 'tokyo', label: 'Tokyo' },
      { value: 'osaka', label: 'Osaka', disabled: true },
    ],
  },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <TreeSelect invalid items={items} placeholder="Choose a region" aria-label="Invalid" />
      <TreeSelect disabled items={items} value="tokyo" aria-label="Disabled" />
      <TreeSelect
        items={items}
        defaultExpanded={['jp']}
        placeholder="With a disabled node"
        aria-label="With a disabled node"
      />
    </Stack>
  )
}
