'use client'

import { Button, Inline, toast } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-3">
      <Button variant="outline" tone="neutral" onClick={() => toast.success('已加入书架')}>
        success
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.danger('网络连接中断')}>
        danger
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.warning('还有未保存的改动')}>
        warning
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.info('新版本已经可用')}>
        info
      </Button>
      <Button variant="outline" tone="neutral" onClick={() => toast.loading('正在同步')}>
        loading
      </Button>
    </Inline>
  )
}
