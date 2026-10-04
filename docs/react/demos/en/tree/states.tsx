import { Stack, Text, Tree, type TreeNode } from '@hina-ui/react'

const items: TreeNode[] = [
  {
    value: 'root',
    label: 'Root',
    children: [
      { value: 'available', label: 'Available node' },
      {
        value: 'disabled',
        label: 'Disabled node',
        disabled: true,
        children: [{ value: 'child', label: 'Descendant of disabled node' }],
      },
    ],
  },
]

export default function Demo() {
  return (
    <Stack className="w-80 max-w-full">
      <Text size="sm" tone="muted">
        Disabled subtree
      </Text>
      <Tree
        multiple
        items={items}
        defaultExpanded={['root', 'disabled']}
        aria-label="Disabled subtree"
      />
      <Text size="sm" tone="muted">
        Disabled tree
      </Text>
      <Tree
        multiple
        disabled
        items={items}
        value={['available']}
        defaultExpanded={['root']}
        aria-label="Disabled tree"
      />
    </Stack>
  )
}
