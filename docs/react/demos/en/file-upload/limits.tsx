'use client'

import { useState } from 'react'
import { FileUpload, Stack, Text, type FileUploadRejection } from '@hina-ui/react'

const reasons: Record<FileUploadRejection['reason'], string> = {
  type: 'not an image',
  size: 'over 2 MB',
  count: 'more than 3 files',
}

export default function Demo() {
  const [notice, setNotice] = useState('')

  function onReject(rejections: FileUploadRejection[]) {
    setNotice(rejections.map(r => `${r.file.name}: ${reasons[r.reason]}`).join('; '))
  }

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <FileUpload
        defaultValue={[]}
        multiple
        accept="image/*"
        maxSize={2 * 1024 * 1024}
        maxFiles={3}
        aria-label="Upload images"
        onReject={onReject}
      >
        Up to 3 images, 2 MB each
      </FileUpload>
      {notice && (
        <Text tone="danger" size="sm">
          {notice}
        </Text>
      )}
    </Stack>
  )
}
