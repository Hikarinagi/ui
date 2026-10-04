'use client'

import { useState } from 'react'
import { AlertDialog, Button, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [fail, setFail] = useState(false)
  const [status, setStatus] = useState('')

  async function archive() {
    setStatus('')
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail) {
      throw new Error('归档失败，请稍后再试。')
    }
    setStatus('已归档。')
  }
  function handleError(error: unknown) {
    setStatus(error instanceof Error ? error.message : String(error))
  }

  return (
    <Stack gap="md" align="start">
      <Switch checked={fail} onCheckedChange={setFail}>
        模拟失败
      </Switch>
      <AlertDialog
        title="归档这个项目？"
        description="归档后项目变为只读，可以随时恢复。"
        confirmText="归档"
        onConfirm={archive}
        onError={handleError}
        content={
          status && (
            <Text tone="muted" size="sm">
              {status}
            </Text>
          )
        }
      >
        <Button variant="outline" tone="neutral">
          归档项目
        </Button>
      </AlertDialog>
    </Stack>
  )
}
