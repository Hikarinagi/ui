'use client'

import { Button, toast } from '@hina-ui/react'

function sync() {
  toast.loading('正在同步', { id: 'sync' })
  setTimeout(() => toast.loading('已同步 12 / 30', { id: 'sync' }), 1000)
  setTimeout(() => toast.success('同步完成', { id: 'sync' }), 2000)
}

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={sync}>
      开始同步
    </Button>
  )
}
