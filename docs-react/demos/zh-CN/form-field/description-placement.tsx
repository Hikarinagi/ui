import { FormField, Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full">
      <FormField
        label="显示名称"
        orientation="responsive"
        descriptionPlacement="label"
        description="显示在你的公开个人资料中。"
      >
        <Input defaultValue="Hina" />
      </FormField>
      <FormField
        label="邮箱地址"
        orientation="responsive"
        descriptionPlacement="control"
        description="使用可以接收通知的邮箱地址。"
        error="请输入邮箱地址。"
      >
        <Input defaultValue="" type="email" />
      </FormField>
    </Stack>
  )
}
