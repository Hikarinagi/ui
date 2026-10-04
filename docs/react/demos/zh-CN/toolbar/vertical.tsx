'use client'

import { useState } from 'react'
import { MousePointer2, Hand, Type, Plus } from 'lucide-react'
import {
  Toolbar,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
} from '@hina-ui/react'

export default function Demo() {
  const [tool, setTool] = useState<string | undefined>('pointer')

  return (
    <Toolbar label="纵向工具" orientation="vertical" size="sm">
      <ToolbarToggleGroup value={tool} onValueChange={setTool} label="工具">
        <ToolbarToggleItem value="pointer" label="选择" side="right">
          <MousePointer2 />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="hand" label="移动" side="right">
          <Hand />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="text" label="文字" side="right">
          <Type />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton label="添加" side="right">
        <Plus />
      </ToolbarButton>
    </Toolbar>
  )
}
