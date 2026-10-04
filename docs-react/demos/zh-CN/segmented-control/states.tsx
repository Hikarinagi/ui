import { SegmentedControl, Stack } from '@hina-ui/react'

const options = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结' },
]
const partial = [
  { value: 'all', label: '全部' },
  { value: 'ongoing', label: '连载中' },
  { value: 'done', label: '已完结', disabled: true },
]

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <SegmentedControl options={options} value="all" disabled aria-label="整组禁用" />
      <SegmentedControl options={partial} value="all" aria-label="单项禁用" />
    </Stack>
  )
}
