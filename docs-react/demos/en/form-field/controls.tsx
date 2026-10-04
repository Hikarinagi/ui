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
  { label: 'Game', value: 'game' },
  { label: 'Novel', value: 'novel' },
  { label: 'Manga', value: 'manga' },
]

export default function Demo() {
  return (
    <Stack gap="md" align="stretch" className="w-80">
      <FormField label="Kind">
        <RadioGroup defaultValue="game" options={kinds} orientation="horizontal" />
      </FormField>
      <FormField label="Tags">
        <CheckboxGroup defaultValue={[]} options={kinds} orientation="horizontal" />
      </FormField>
      <FormField label="Score">
        <Rating defaultValue={4} />
      </FormField>
      <FormField label="Volume">
        <Slider defaultValue={30} />
      </FormField>
      <FormField label="Release date">
        <DateField defaultValue={null} />
      </FormField>
    </Stack>
  )
}
