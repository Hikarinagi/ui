import { Stack, TagsInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput defaultValue={['Invalid']} invalid aria-label="Invalid" />
      <TagsInput defaultValue={['Disabled']} disabled aria-label="Disabled" />
      <TagsInput defaultValue={['Secondary']} variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
