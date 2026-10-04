'use client'

import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { Button, Inline, QRCode, Stack, Text, type QRCodeExpose } from '@hina-ui/react'

export default function Demo() {
  const code = useRef<QRCodeExpose>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const urls = useRef(new Set<string>())

  async function save(type: 'image/png' | 'image/svg+xml') {
    if (!code.current || busy) return
    setBusy(true)
    setError(false)
    try {
      const blob = await code.current.toBlob({ type, scale: 3 })
      const url = URL.createObjectURL(blob)
      urls.current.add(url)
      const link = document.createElement('a')
      link.href = url
      link.download = type === 'image/png' ? 'hina-ui.png' : 'hina-ui.svg'
      link.click()
      setTimeout(() => {
        URL.revokeObjectURL(url)
        urls.current.delete(url)
      }, 1000)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const pending = urls.current
    return () => pending.forEach(url => URL.revokeObjectURL(url))
  }, [])

  return (
    <Stack align="center" data-demo-qr-export="">
      <QRCode ref={code} value="https://hinaui.dev" logo="/favicon.png" label="Hina UI 文档站" />
      <Inline gap="sm">
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => save('image/png')}
          icon={<Download />}
        >
          PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => save('image/svg+xml')}
          icon={<Download />}
        >
          SVG
        </Button>
      </Inline>
      {error && (
        <Text tone="danger" size="sm" role="alert">
          导出失败，请重试。
        </Text>
      )}
    </Stack>
  )
}
