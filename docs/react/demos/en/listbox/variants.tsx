import { Listbox, Stack } from '@hina-ui/react'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Listbox options={options} value="a" aria-label="Primary" />
      <Listbox variant="secondary" options={options} value="a" aria-label="Secondary" />
      <Listbox variant="bare" options={options} value="a" aria-label="Bare" />
    </Stack>
  )
}
