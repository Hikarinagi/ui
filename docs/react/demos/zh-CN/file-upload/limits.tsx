'use client'

import { useState } from 'react'
import { FileUpload, Stack, Text, type FileUploadRejection } from '@hina-ui/react'

const reasons: Record<FileUploadRejection['reason'], string> = {
  type: '不是图片',
  size: '超过 2 MB',
  count: '超过 3 个',
}

export default function Demo() {
  const [notice, setNotice] = useState('')

  function onReject(rejections: FileUploadRejection[]) {
    setNotice(rejections.map(r => `${r.file.name}：${reasons[r.reason]}`).join('；'))
  }

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <FileUpload
        defaultValue={[]}
        multiple
        accept="image/*"
        maxSize={2 * 1024 * 1024}
        maxFiles={3}
        aria-label="上传图片"
        onReject={onReject}
      >
        最多 3 张图片，每张不超过 2 MB
      </FileUpload>
      {notice && (
        <Text tone="danger" size="sm">
          {notice}
        </Text>
      )}
    </Stack>
  )
}
