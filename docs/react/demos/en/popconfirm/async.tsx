'use client'

import { useState } from 'react'
import { Button, Popconfirm, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [fail, setFail] = useState(false)
  const [status, setStatus] = useState('')

  async function retry() {
    setStatus('')
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail) {
      setStatus('Sending failed, please try again later.')
      throw new Error('retry failed')
    }
    setStatus('Sent again.')
  }

  return (
    <Stack gap="md" align="start">
      <Switch checked={fail} onCheckedChange={setFail}>
        Simulate a failure
      </Switch>
      <Popconfirm
        title="Send this email again?"
        confirmText="Resend"
        onConfirm={retry}
        content={
          status ? (
            <Text tone="muted" size="sm">
              {status}
            </Text>
          ) : null
        }
      >
        <Button variant="outline" tone="neutral">
          Resend
        </Button>
      </Popconfirm>
    </Stack>
  )
}
