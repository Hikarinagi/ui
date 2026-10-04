import { FormField, Input, Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="md" align="stretch" className="w-80">
      <FormField label="Nickname" description="Shown on your profile page and editable any time">
        <Input defaultValue="" />
      </FormField>
      <FormField label="Bio" description="Up to 80 characters, line breaks allowed.">
        <Textarea defaultValue="" />
      </FormField>
    </Stack>
  )
}
