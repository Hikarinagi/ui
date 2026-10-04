import { FormField, Input, Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="md" align="stretch" className="w-80">
      <FormField label="昵称" description="公开显示在个人页，可以随时修改">
        <Input defaultValue="" />
      </FormField>
      <FormField label="简介" description="不超过 80 个字，支持换行。">
        <Textarea defaultValue="" />
      </FormField>
    </Stack>
  )
}
