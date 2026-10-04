'use client'

import { useState } from 'react'
import { PasswordInput, Stack } from '@hina-ui/react'

export default function Demo() {
  const [visible, setVisible] = useState(false)

  return (
    <Stack className="w-64">
      <PasswordInput
        defaultValue=""
        visible={visible}
        onVisibleChange={setVisible}
        aria-label="新密码"
        placeholder="新密码"
        autoComplete="new-password"
      />
      <PasswordInput
        defaultValue=""
        visible={visible}
        onVisibleChange={setVisible}
        aria-label="确认密码"
        placeholder="确认密码"
        autoComplete="new-password"
      />
    </Stack>
  )
}
