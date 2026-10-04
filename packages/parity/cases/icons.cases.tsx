import { h } from 'vue'
import * as V from '@hina-ui/vue/../node_modules/@lucide/vue'
import * as R from '@hina-ui/react/../node_modules/lucide-react'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const names = [
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowUpRight',
  'BookOpen',
  'CalendarClock',
  'CalendarDays',
  'CalendarRange',
  'Check',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronsLeft',
  'ChevronsRight',
  'ChevronsUpDown',
  'ChevronUp',
  'CircleAlert',
  'CircleCheck',
  'CircleX',
  'Copy',
  'Download',
  'Eye',
  'EyeOff',
  'File',
  'FileIcon',
  'GripVertical',
  'House',
  'Inbox',
  'Info',
  'LayoutGrid',
  'Lightbulb',
  'List',
  'Mail',
  'Megaphone',
  'Minus',
  'MoreHorizontal',
  'PanelLeft',
  'Pause',
  'Pencil',
  'Play',
  'Plus',
  'QrCode',
  'RefreshCw',
  'RotateCw',
  'Scan',
  'Search',
  'Shrink',
  'Star',
  'TrendingDown',
  'TrendingUp',
  'TriangleAlert',
  'Upload',
  'User',
  'ZoomIn',
  'ZoomOut',
] as const

export default defineCases(
  'Built-in icons',
  names.flatMap(name => {
    const Icon = lucide(R[name])
    return [
      {
        name,
        vue: () => h(V[name]),
        react: () => <Icon />,
      },
      {
        name: `${name} with size, stroke, class and label`,
        vue: () =>
          h(V[name], { size: 16, 'stroke-width': 1.5, class: 'shrink-0', 'aria-label': name }),
        react: () => <Icon size={16} strokeWidth={1.5} className="shrink-0" aria-label={name} />,
      },
    ]
  }),
)
