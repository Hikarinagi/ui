import { Checkbox, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Checkbox invalid>我已阅读并同意用户协议</Checkbox>
      <Checkbox disabled>已禁用</Checkbox>
      <Checkbox disabled checked>
        已禁用且选中
      </Checkbox>
    </Stack>
  )
}
