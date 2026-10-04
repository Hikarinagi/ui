'use client'

import { Heart } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm" align="center">
      <Toggle size="sm" variant="outline" value renderIcon={() => <Heart />}>
        Small
      </Toggle>
      <Toggle size="md" variant="outline" value renderIcon={() => <Heart />}>
        Medium
      </Toggle>
      <Toggle size="lg" variant="outline" value renderIcon={() => <Heart />}>
        Large
      </Toggle>
    </Inline>
  )
}
