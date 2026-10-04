import { Stack, TreeSelect, type TreeSelectNode } from '@hina-ui/react'

const items: TreeSelectNode[] = [
  {
    value: 'jp',
    label: '日本',
    children: [
      { value: 'tokyo', label: '东京' },
      { value: 'osaka', label: '大阪', disabled: true },
    ],
  },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <TreeSelect invalid items={items} placeholder="请选择地区" aria-label="校验未通过" />
      <TreeSelect disabled items={items} value="tokyo" aria-label="已禁用" />
      <TreeSelect
        items={items}
        defaultExpanded={['jp']}
        placeholder="含禁用节点"
        aria-label="含禁用节点"
      />
    </Stack>
  )
}
