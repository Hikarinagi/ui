'use client'

import { useState } from 'react'
import { FormField, Input, QRCode, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState('https://hinaui.dev')

  return (
    <Stack align="center" className="w-full max-w-sm" data-demo-qr-hero="">
      <QRCode value={value} label="Hina UI documentation" />
      <Text size="sm" tone="muted">
        Scan with your phone to open the link
      </Text>
      <FormField label="QR code content" className="w-full">
        <Input value={value} onValueChange={setValue} placeholder="https://hinaui.dev" />
      </FormField>
    </Stack>
  )
}
