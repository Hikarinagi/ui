import { Card, Select, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Select options={options} placeholder="直接放在页面上" aria-label="页面上的选择框" />
      <Card>
        <Select
          variant="secondary"
          options={options}
          placeholder="放在卡片内"
          aria-label="卡片内的选择框"
        />
      </Card>
    </Stack>
  )
}
