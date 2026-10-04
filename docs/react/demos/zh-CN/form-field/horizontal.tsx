import { FormField, Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <FormField
      label="显示名称"
      orientation="horizontal"
      labelWidth="8rem"
      description="显示在你的公开个人资料中。"
      className="w-full"
    >
      <Input defaultValue="Hina" />
    </FormField>
  )
}
