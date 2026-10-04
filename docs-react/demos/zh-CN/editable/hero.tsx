import { Card, Editable, FormField, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-lg">
      <Stack gap="lg">
        <Text weight="medium">项目信息</Text>
        <FormField label="项目名称">
          <Editable defaultValue="Hina UI 组件库" maxlength={60} />
        </FormField>
        <FormField label="简介">
          <Editable
            defaultValue="为内容站与管理后台提供一致、克制的交互体验。"
            multiline
            rows={3}
          />
        </FormField>
        <Text size="sm" tone="muted">
          单击文字修改。回车保存，Esc 取消；多行文本用 Ctrl / ⌘ + Enter 保存。
        </Text>
      </Stack>
    </Card>
  )
}
