'use client'

import { Bold } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm">
      <Toggle variant="outline" disabled renderIcon={() => <Bold />}>
        Disabled
      </Toggle>
      <Toggle variant="outline" disabled value renderIcon={() => <Bold />}>
        Disabled and pressed
      </Toggle>
    </Inline>
  )
}
