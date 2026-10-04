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
      throw new Error('Archiving failed, please try again later.')
    }
    setStatus('Archived.')
  }
  function handleError(error: unknown) {
    setStatus(error instanceof Error ? error.message : String(error))
  }

  return (
    <Stack gap="md" align="start">
      <Switch checked={fail} onCheckedChange={setFail}>
        Simulate a failure
      </Switch>
      <AlertDialog
        title="Archive this project?"
        description="An archived project becomes read-only and can be restored at any time."
        confirmText="Archive"
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
          Archive project
        </Button>
      </AlertDialog>
    </Stack>
  )
}
