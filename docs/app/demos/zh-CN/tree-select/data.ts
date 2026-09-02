import type { TreeSelectNode } from '@hina-ui/vue'

export const regions: TreeSelectNode[] = [
  {
    value: 'jp',
    label: '日本',
    children: [
      {
        value: 'kanto',
        label: '关东',
        children: [
          { value: 'tokyo', label: '东京' },
          { value: 'yokohama', label: '横滨' },
        ],
      },
      {
        value: 'kansai',
        label: '关西',
        children: [
          { value: 'osaka', label: '大阪' },
          { value: 'kyoto', label: '京都' },
        ],
      },
    ],
  },
  {
    value: 'cn',
    label: '中国',
    children: [
      { value: 'shanghai', label: '上海' },
      { value: 'hangzhou', label: '杭州' },
    ],
  },
]
