import type { TreeSelectNode } from '@hina-ui/vue'

export const regions: TreeSelectNode[] = [
  {
    value: 'jp',
    label: 'Japan',
    children: [
      {
        value: 'kanto',
        label: 'Kanto',
        children: [
          { value: 'tokyo', label: 'Tokyo' },
          { value: 'yokohama', label: 'Yokohama' },
        ],
      },
      {
        value: 'kansai',
        label: 'Kansai',
        children: [
          { value: 'osaka', label: 'Osaka' },
          { value: 'kyoto', label: 'Kyoto' },
        ],
      },
    ],
  },
  {
    value: 'cn',
    label: 'China',
    children: [
      { value: 'shanghai', label: 'Shanghai' },
      { value: 'hangzhou', label: 'Hangzhou' },
    ],
  },
]
