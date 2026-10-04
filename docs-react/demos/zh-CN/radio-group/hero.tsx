'use client'

import { useState } from 'react'
import { RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
  { value: 'done', label: '看过' },
]

export default function Demo() {
  const [status, setStatus] = useState<string | number | null | undefined>('doing')

  return (
    <RadioGroup value={status} onValueChange={setStatus} options={options} aria-label="收藏状态" />
  )
}
