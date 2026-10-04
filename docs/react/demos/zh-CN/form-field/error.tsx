'use client'

import { useState } from 'react'
import { FormField, Input, Stack, Switch } from '@hina-ui/react'

export default function Demo() {
  const [failed, setFailed] = useState(true)

  return (
    <Stack gap="md" align="stretch" className="w-80">
      <Switch checked={failed} onCheckedChange={setFailed}>
        显示错误
      </Switch>
      <FormField label="邮箱" error={failed ? '邮箱格式不正确' : undefined}>
        <Input defaultValue="shion@example" type="email" />
      </FormField>
    </Stack>
  )
}
