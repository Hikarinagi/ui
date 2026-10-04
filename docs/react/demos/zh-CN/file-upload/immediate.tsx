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
        aria-label="上传图片"
        onValueChange={send}
      >
        拖拽或者点击，选中即上传
      </FileUpload>
      <Text tone="muted" size="sm">
        已交给上传流程：{sent.length ? sent.join('、') : '无'}
      </Text>
    </Stack>
  )
}
