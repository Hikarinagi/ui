import { Editable, FormField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm" gap="lg">
      <FormField label="双击进入" description="键盘聚焦后仍可按 Enter 或空格进入。">
        <Editable defaultValue="双击修改文档标题" activationMode="dblclick" />
      </FormField>
      <FormField label="手动进入" description="草稿一直保留到按下保存或取消。">
        <Editable defaultValue="按编辑按钮修改" activationMode="manual" submitMode="manual" />
      </FormField>
    </Stack>
  )
}
