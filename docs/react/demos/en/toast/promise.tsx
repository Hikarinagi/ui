'use client'

import { Button, toast } from '@hina-ui/react'

function upload() {
  const task = new Promise<{ name: string }>(resolve =>
    setTimeout(() => resolve({ name: 'beyond-the-stars.epub' }), 2000),
  )
  toast.promise(task, {
    loading: 'Uploading',
    success: book => `${book.name} uploaded`,
    error: 'Upload failed, please try again',
  })
}

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={upload}>
      Upload a file
    </Button>
  )
}
