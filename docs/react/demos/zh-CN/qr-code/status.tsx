'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCode, Select, Stack, Text, type QRCodeStatus } from '@hina-ui/react'

const options = [
  { value: 'active', label: '可扫描' },
  { value: 'loading', label: '加载中' },
  { value: 'expired', label: '已过期' },
  { value: 'scanned', label: '已扫描' },
]

export default function Demo() {
  const [status, setStatus] = useState<QRCodeStatus>('expired')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  function refresh() {
    clearTimeout(timer.current)
    setStatus('loading')
    timer.current = setTimeout(() => {
      setStatus('active')
    }, 800)
  }

  function change(value: unknown) {
    clearTimeout(timer.current)
    setStatus(value as QRCodeStatus)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <Stack align="center" className="w-full max-w-sm" data-demo-qr-status="">
      <QRCode value="https://hinaui.dev" status={status} onRefresh={refresh} />
      <Select
        value={status}
        options={options}
        aria-label="二维码状态"
        className="w-48"
        onValueChange={change}
      />
      <Text size="sm" tone="muted" className="text-center">
        刷新在这里模拟一次异步请求，状态由调用方控制。
      </Text>
    </Stack>
  )
}
