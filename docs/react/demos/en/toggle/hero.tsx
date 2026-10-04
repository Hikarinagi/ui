'use client'

import { useState } from 'react'
import { Bold, Italic, Underline } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  const [bold, setBold] = useState(true)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)

  return (
    <Inline gap="xs">
      <Toggle value={bold} onValueChange={setBold} label="Bold" renderIcon={() => <Bold />} />
      <Toggle
        value={italic}
        onValueChange={setItalic}
        label="Italic"
        renderIcon={() => <Italic />}
      />
      <Toggle
        value={underline}
        onValueChange={setUnderline}
        label="Underline"
        renderIcon={() => <Underline />}
      />
    </Inline>
  )
}
