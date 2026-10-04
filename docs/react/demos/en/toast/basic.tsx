'use client'

import { Button, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={() => toast('Draft saved')}>
      Save draft
    </Button>
  )
}
