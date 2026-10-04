import { Stack, TagsInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput size="sm" defaultValue={['Small']} aria-label="Small" />
      <TagsInput size="md" defaultValue={['Medium']} aria-label="Medium" />
      <TagsInput size="lg" defaultValue={['Large']} aria-label="Large" />
    </Stack>
  )
}
