import {
  CheckboxGroup,
  DateField,
  FormField,
  RadioGroup,
  Rating,
  Slider,
  Stack,
} from '@hina-ui/react'

const kinds = [
  { label: '游戏', value: 'game' },
  { label: '小说', value: 'novel' },
  { label: '漫画', value: 'manga' },
]

export default function Demo() {
  return (
    <Stack gap="md" align="stretch" className="w-80">
      <FormField label="类型">
        <RadioGroup defaultValue="game" options={kinds} orientation="horizontal" />
      </FormField>
      <FormField label="标签">
        <CheckboxGroup defaultValue={[]} options={kinds} orientation="horizontal" />
      </FormField>
      <FormField label="评分">
        <Rating defaultValue={4} />
      </FormField>
      <FormField label="音量">
        <Slider defaultValue={30} />
      </FormField>
      <FormField label="发售日期">
        <DateField defaultValue={null} />
      </FormField>
    </Stack>
  )
}
