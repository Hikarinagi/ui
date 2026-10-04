import { Stack, TagsInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <TagsInput defaultValue={['校验未通过']} invalid aria-label="校验未通过" />
      <TagsInput defaultValue={['已禁用']} disabled aria-label="已禁用" />
      <TagsInput defaultValue={['扁平形态']} variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
