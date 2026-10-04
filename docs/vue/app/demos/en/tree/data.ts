import type { TreeNode } from '@hina-ui/vue'

export const nodes: TreeNode[] = [
  {
    value: 'a',
    label: 'Group A',
    children: [
      { value: 'a-1', label: 'Node A.1' },
      {
        value: 'a-2',
        label: 'Group A.2',
        children: [
          { value: 'a-2-1', label: 'Node A.2.1' },
          { value: 'a-2-2', label: 'Node A.2.2' },
        ],
      },
    ],
  },
  {
    value: 'b',
    label: 'Group B',
    children: [
      { value: 'b-1', label: 'Node B.1' },
      { value: 'b-2', label: 'Node B.2', disabled: true },
    ],
  },
]
