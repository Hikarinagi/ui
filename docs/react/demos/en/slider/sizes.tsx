import { Slider, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-64">
      <Slider size="sm" value={30} aria-label="Small" />
      <Slider size="md" value={50} aria-label="Medium" />
      <Slider size="lg" value={70} aria-label="Large" />
    </Stack>
  )
}
