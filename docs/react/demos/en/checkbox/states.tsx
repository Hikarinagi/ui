import { Checkbox, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Checkbox invalid>I have read and accept the terms</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox disabled checked>
        Disabled and checked
      </Checkbox>
    </Stack>
  )
}
