'use client'

import { useState } from 'react'
import { FileUpload, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <FileUpload
        value={files}
        onValueChange={next => setFiles(next as File[])}
        multiple
        aria-label="上传附件"
      />
      <Text tone="muted" size="sm">
        已选 {files.length} 个文件
      </Text>
    </Stack>
  )
}
