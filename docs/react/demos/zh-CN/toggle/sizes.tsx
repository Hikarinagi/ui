'use client'

import { Heart } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm" align="center">
      <Toggle size="sm" variant="outline" value renderIcon={() => <Heart />}>
        小号
      </Toggle>
      <Toggle size="md" variant="outline" value renderIcon={() => <Heart />}>
        中号
      </Toggle>
      <Toggle size="lg" variant="outline" value renderIcon={() => <Heart />}>
        大号
      </Toggle>
    </Inline>
  )
}
