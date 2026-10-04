'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@hina-ui/react'

export default function Demo() {
  const [uploading, setUploading] = useState(false)

  function upload() {
    setUploading(true)
    setTimeout(() => setUploading(false), 2000)
  }

  return (
    <Button loading={uploading} onClick={upload} icon={<Upload />}>
      {uploading ? 'Uploading…' : 'Upload file'}
    </Button>
  )
}
