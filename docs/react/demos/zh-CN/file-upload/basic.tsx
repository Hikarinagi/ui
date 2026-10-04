'use client'

import { useState } from 'react'
import { FileUpload, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <FileUpload
        value={file}
        onValueChange={next => setFile(next as File | null)}
        aria-label="上传封面"
      />
      <Text tone="muted" size="sm">
        值：{file?.name ?? '空'}
      </Text>
    </Stack>
  )
}
