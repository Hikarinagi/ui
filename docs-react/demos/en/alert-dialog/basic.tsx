'use client'

import { useState } from 'react'
import { AlertDialog, Button, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [published, setPublished] = useState(false)
  return (
    <Stack gap="sm" align="start">
      <AlertDialog
        title="Publish this article?"
        description="Once published, everyone can see it."
        confirmText="Publish"
        cancelText="Not yet"
        onConfirm={() => setPublished(true)}
      >
        <Button variant="outline" tone="neutral">
          Publish
        </Button>
      </AlertDialog>
      {published && (
        <Text tone="muted" size="sm">
          The article was published.
        </Text>
      )}
    </Stack>
  )
}
