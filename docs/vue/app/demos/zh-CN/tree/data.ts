import type { TreeNode } from '@hina-ui/vue'

export const nodes: TreeNode[] = [
  {
    value: 'a',
    label: '分组 A',
    children: [
      { value: 'a-1', label: '节点 A.1' },
      {
        value: 'a-2',
        label: '分组 A.2',
        children: [
          { value: 'a-2-1', label: '节点 A.2.1' },
          { value: 'a-2-2', label: '节点 A.2.2' },
        ],
      },
    ],
  },
  {
    value: 'b',
    label: '分组 B',
    children: [
      { value: 'b-1', label: '节点 B.1' },
      { value: 'b-2', label: '节点 B.2', disabled: true },
    ],
  },
]
