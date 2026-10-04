'use client'

import { useState } from 'react'
import { FileUpload, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [files, setFiles] = useState<File[]>([])
  const [sent, setSent] = useState<string[]>([])

  function send(next: File | File[] | null) {
    const picked = Array.isArray(next) ? next : next ? [next] : []
    setSent(current => [...current, ...picked.map(file => file.name)])
    setFiles([])
  }

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <FileUpload
        value={files}
        list={false}
        multiple
        accept="image/*"
        aria-label="Upload images"
        onValueChange={send}
      >
        Drop or click, uploads on pick
      </FileUpload>
      <Text tone="muted" size="sm">
        Handed to the upload flow: {sent.length ? sent.join(', ') : 'none'}
      </Text>
    </Stack>
  )
}
