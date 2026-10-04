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
    setResult(`Returned after ${ms} ms`)
  }

  return (
    <Stack gap="md" align="start">
      <Inline gap="md" align="center">
        <Button variant="outline" tone="neutral" disabled={loading} onClick={() => request(150)}>
          Fast request
        </Button>
        <Button variant="outline" tone="neutral" disabled={loading} onClick={() => request(1500)}>
          Slow request
        </Button>
        <Switch checked={immediate} onCheckedChange={setImmediate}>
          Show at once
        </Switch>
      </Inline>
      <Card className="relative w-96">
        <Text>
          {result ||
            'With the default delay the fast request never shows the overlay; with "Show at once" both do.'}
        </Text>
        <LoadingOverlay visible={loading} delay={immediate ? 0 : undefined} />
      </Card>
    </Stack>
  )
}
