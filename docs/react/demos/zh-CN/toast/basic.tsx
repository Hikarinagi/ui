'use client'

import { Button, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={() => toast('草稿已保存')}>
      保存草稿
    </Button>
  )
}
