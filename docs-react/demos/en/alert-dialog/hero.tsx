'use client'

import { useState } from 'react'
import { AlertDialog, Button, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [removed, setRemoved] = useState(false)

  async function remove() {
    await new Promise(resolve => setTimeout(resolve, 800))
    setRemoved(true)
  }

  return (
    <Stack gap="sm" align="start">
      <AlertDialog
        title="Delete this article?"
        description="This cannot be undone, and the comments under it are deleted as well."
        tone="danger"
        confirmText="Delete"
        onConfirm={remove}
      >
        <Button variant="outline" tone="danger">
          Delete article
        </Button>
      </AlertDialog>
      {removed && (
        <Text tone="muted" size="sm">
          The article was deleted.
        </Text>
      )}
    </Stack>
  )
}
