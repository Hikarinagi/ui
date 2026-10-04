'use client'

import { useState } from 'react'
import { Checkbox } from '@hina-ui/react'

export default function Demo() {
  const [weekly, setWeekly] = useState<boolean | 'indeterminate'>(true)

  return (
    <Checkbox
      checked={weekly}
      onCheckedChange={setWeekly}
      description="每周一发送本周的更新汇总，可以随时退订。"
    >
      订阅周报
    </Checkbox>
  )
}
