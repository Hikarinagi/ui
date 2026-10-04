'use client'

import { Bold } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm">
      <Toggle variant="outline" disabled renderIcon={() => <Bold />}>
        已禁用
      </Toggle>
      <Toggle variant="outline" disabled value renderIcon={() => <Bold />}>
        禁用且按下
      </Toggle>
    </Inline>
  )
}
