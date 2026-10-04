'use client'

import { Button, toast } from '@hina-ui/react'

function upload() {
  const task = new Promise<{ name: string }>(resolve =>
    setTimeout(() => resolve({ name: 'ATRI.epub' }), 2000),
  )
  toast.promise(task, {
    loading: '正在上传',
    success: book => `${book.name} 上传完成`,
    error: '上传失败，请重试',
  })
}

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={upload}>
      上传文件
    </Button>
  )
}
