import { FormField, Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-2xl resize-x overflow-auto p-2">
      <FormField
        label="显示名称"
        orientation="responsive"
        description="拖动容器右下角调整宽度；字段宽度小于 32rem 时纵向排列。"
      >
        <Input defaultValue="Hina" />
      </FormField>
    </Stack>
  )
}
