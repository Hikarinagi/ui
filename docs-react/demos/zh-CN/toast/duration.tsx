'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast('一秒后消失', { duration: 1000 })}
      >
        一秒
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() => toast.info('需要手动关闭', { id: 'sticky', duration: 0 })}
      >
        不自动关闭
      </Button>
      <Button variant="soft" tone="neutral" onClick={() => toast.dismiss('sticky')}>
        关闭上一条
      </Button>
    </Inline>
  )
}
