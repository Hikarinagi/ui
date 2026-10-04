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
        title="删除这篇文章？"
        description="删除后无法恢复，文章下的评论也会一并删除。"
        tone="danger"
        confirmText="删除"
        onConfirm={remove}
      >
        <Button variant="outline" tone="danger">
          删除文章
        </Button>
      </AlertDialog>
      {removed && (
        <Text tone="muted" size="sm">
          文章已删除。
        </Text>
      )}
    </Stack>
  )
}
