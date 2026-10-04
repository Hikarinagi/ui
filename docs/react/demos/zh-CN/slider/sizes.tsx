import { Slider, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-64">
      <Slider size="sm" value={30} aria-label="小号" />
      <Slider size="md" value={50} aria-label="中号" />
      <Slider size="lg" value={70} aria-label="大号" />
    </Stack>
  )
}
