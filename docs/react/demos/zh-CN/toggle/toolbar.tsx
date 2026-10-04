'use client'

import { useState } from 'react'
import { Bold, Italic, Strikethrough, Underline } from 'lucide-react'
import { Inline, Toggle } from '@hina-ui/react'

export default function Demo() {
  const [marks, setMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  })

  return (
    <Inline gap="xs">
      <Toggle
        value={marks.bold}
        onValueChange={bold => setMarks({ ...marks, bold })}
        label="加粗"
        size="sm"
        renderIcon={() => <Bold />}
      />
      <Toggle
        value={marks.italic}
        onValueChange={italic => setMarks({ ...marks, italic })}
        label="斜体"
        size="sm"
        renderIcon={() => <Italic />}
      />
      <Toggle
        value={marks.underline}
        onValueChange={underline => setMarks({ ...marks, underline })}
        label="下划线"
        size="sm"
        renderIcon={() => <Underline />}
      />
      <Toggle
        value={marks.strike}
        onValueChange={strike => setMarks({ ...marks, strike })}
        label="删除线"
        size="sm"
        renderIcon={() => <Strikethrough />}
      />
    </Inline>
  )
}
