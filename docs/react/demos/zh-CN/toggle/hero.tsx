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
      <Toggle value={bold} onValueChange={setBold} label="加粗" renderIcon={() => <Bold />} />
      <Toggle value={italic} onValueChange={setItalic} label="斜体" renderIcon={() => <Italic />} />
      <Toggle
        value={underline}
        onValueChange={setUnderline}
        label="下划线"
        renderIcon={() => <Underline />}
      />
    </Inline>
  )
}
