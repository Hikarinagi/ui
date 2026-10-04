import { Stack, TagsInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput size="sm" defaultValue={['小号']} aria-label="小号" />
      <TagsInput size="md" defaultValue={['中号']} aria-label="中号" />
      <TagsInput size="lg" defaultValue={['大号']} aria-label="大号" />
    </Stack>
  )
}
