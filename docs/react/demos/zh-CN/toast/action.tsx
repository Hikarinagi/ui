'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast('已移入回收站', {
            action: { label: '撤销', onClick: () => toast.success('已还原') },
          })
        }
      >
        带操作
      </Button>
      <Button
        variant="outline"
        tone="neutral"
        onClick={() =>
          toast.warning('确定要清空吗', {
            duration: 0,
            action: { label: '清空', onClick: () => toast.success('已清空') },
            cancel: { label: '取消' },
          })
        }
      >
        两个按钮
      </Button>
    </Inline>
  )
}
