'use client'

import { Button, toast } from '@hina-ui/react'

function sync() {
  toast.loading('Syncing', { id: 'sync' })
  setTimeout(() => toast.loading('Synced 12 of 30', { id: 'sync' }), 1000)
  setTimeout(() => toast.success('Sync finished', { id: 'sync' }), 2000)
}

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={sync}>
      Start syncing
    </Button>
  )
}
