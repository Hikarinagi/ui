'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCode, Select, Stack, Text, type QRCodeStatus } from '@hina-ui/react'

const options = [
  { value: 'active', label: 'Active' },
  { value: 'loading', label: 'Loading' },
  { value: 'expired', label: 'Expired' },
  { value: 'scanned', label: 'Scanned' },
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
        aria-label="QR code status"
        className="w-48"
        onValueChange={change}
      />
      <Text size="sm" tone="muted" className="text-center">
        Refresh simulates a request here. The application controls the status.
      </Text>
    </Stack>
  )
}
