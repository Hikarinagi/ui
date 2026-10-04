'use client'

import { useState } from 'react'
import { Bold, Italic, Underline, Undo2, Redo2 } from 'lucide-react'
import {
  Toolbar,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
} from '@hina-ui/react'

export default function Demo() {
  const [formats, setFormats] = useState(['bold'])

  return (
    <Toolbar label="文本工具" size="sm">
      <ToolbarButton label="撤销">
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton label="重做" disabled>
        <Redo2 />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup value={formats} onValueChange={setFormats} type="multiple" label="格式">
        <ToolbarToggleItem value="bold" label="加粗">
          <Bold />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" label="斜体">
          <Italic />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="underline" label="下划线">
          <Underline />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  )
}
