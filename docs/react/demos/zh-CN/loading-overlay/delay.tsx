'use client'

import { useState } from 'react'
import { Button, Card, Inline, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [immediate, setImmediate] = useState(false)
  const [result, setResult] = useState('')

  async function request(ms: number) {
    setLoading(true)
    setResult('')
    await new Promise(resolve => setTimeout(resolve, ms))
    setLoading(false)
    setResult(`${ms} 毫秒后返回`)
  }

  return (
    <Stack gap="md" align="start">
      <Inline gap="md" align="center">
        <Button variant="outline" tone="neutral" disabled={loading} onClick={() => request(150)}>
          快请求
        </Button>
        <Button variant="outline" tone="neutral" disabled={loading} onClick={() => request(1500)}>
          慢请求
        </Button>
        <Switch checked={immediate} onCheckedChange={setImmediate}>
          立即显示
        </Switch>
      </Inline>
      <Card className="relative w-96">
        <Text>{result || '默认延时下快请求看不到遮罩；打开「立即显示」后两种请求都会看到。'}</Text>
        <LoadingOverlay visible={loading} delay={immediate ? 0 : undefined} />
      </Card>
    </Stack>
  )
}
