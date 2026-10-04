'use client'

import { useState } from 'react'
import { Button, QRCode, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [expired, setExpired] = useState(true)

  return (
    <Stack align="center" data-demo-qr-custom="">
      <QRCode
        value="https://hinaui.dev"
        status={expired ? 'expired' : 'active'}
        size={224}
        onRefresh={() => setExpired(false)}
        renderStatus={({ refresh }) => (
          <>
            <Text weight="medium">分享链接已过期</Text>
            <Text size="xs" tone="muted">
              重新生成后再扫码打开
            </Text>
            <Button size="sm" variant="outline" onClick={refresh}>
              重新生成
            </Button>
          </>
        )}
      />
      <Button variant="ghost" size="sm" disabled={expired} onClick={() => setExpired(true)}>
        模拟过期
      </Button>
    </Stack>
  )
}
