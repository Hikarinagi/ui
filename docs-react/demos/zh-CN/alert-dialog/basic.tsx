'use client'

import { useState } from 'react'
import { AlertDialog, Button, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [published, setPublished] = useState(false)
  return (
    <Stack gap="sm" align="start">
      <AlertDialog
        title="发布这篇文章？"
        description="发布之后所有人都能看到它。"
        confirmText="发布"
        cancelText="再想想"
        onConfirm={() => setPublished(true)}
      >
        <Button variant="outline" tone="neutral">
          发布
        </Button>
      </AlertDialog>
      {published && (
        <Text tone="muted" size="sm">
          文章已发布。
        </Text>
      )}
    </Stack>
  )
}
