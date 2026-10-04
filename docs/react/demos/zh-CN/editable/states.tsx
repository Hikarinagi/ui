import { Editable, FormField, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Editable size="sm" value="小号文本" aria-label="小号" />
      <Editable size="md" value="默认文本" aria-label="默认" />
      <Editable size="lg" value="大号文本" aria-label="大号" />
      <FormField label="只读" description="内容可以选择与复制。">
        <Editable value="只读项目名称" readonly />
      </FormField>
      <FormField label="禁用">
        <Editable value="暂时无法修改" disabled />
      </FormField>
      <FormField label="尚未填写">
        <Editable placeholder="添加备注…" />
      </FormField>
    </Stack>
  )
}
