'use client'

import { useState } from 'react'
import { FormField, Input, QRCode, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [value, setValue] = useState('https://hinaui.dev')

  return (
    <Stack align="center" className="w-full max-w-sm" data-demo-qr-hero="">
      <QRCode value={value} label="Hina UI 文档站" />
      <Text size="sm" tone="muted">
        用手机扫码打开链接
      </Text>
      <FormField label="二维码内容" className="w-full">
        <Input value={value} onValueChange={setValue} placeholder="https://hinaui.dev" />
      </FormField>
    </Stack>
  )
}
