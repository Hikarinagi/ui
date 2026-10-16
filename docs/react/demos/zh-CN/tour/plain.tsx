'use client'

import { useState } from 'react'
import { Button, Inline, Tour, type TourStep } from '@hina-ui/react'

const steps: TourStep[] = [
  { target: '#tour-plain-filter', title: '筛选', description: '页面在引导期间仍可操作。' },
  { target: '#tour-plain-sort', title: '排序', description: '点击切换升序与降序。' },
]

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button id="tour-plain-filter" variant="outline" tone="neutral">
          筛选
        </Button>
        <Button id="tour-plain-sort" variant="outline" tone="neutral">
          排序
        </Button>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          开始引导
        </Button>
      </Inline>
      <Tour steps={steps} open={open} onOpenChange={setOpen} mask={false} />
    </>
  )
}
