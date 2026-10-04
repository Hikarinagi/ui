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
        aria-label="New password"
        placeholder="New password"
        autoComplete="new-password"
      />
      <PasswordInput
        defaultValue=""
        visible={visible}
        onVisibleChange={setVisible}
        aria-label="Confirm password"
        placeholder="Confirm password"
        autoComplete="new-password"
      />
    </Stack>
  )
}
