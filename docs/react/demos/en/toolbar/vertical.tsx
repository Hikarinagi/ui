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
    <Toolbar label="Vertical tools" orientation="vertical" size="sm">
      <ToolbarToggleGroup value={tool} onValueChange={setTool} label="Tools">
        <ToolbarToggleItem value="pointer" label="Select" side="right">
          <MousePointer2 />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="hand" label="Move" side="right">
          <Hand />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="text" label="Text" side="right">
          <Type />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton label="Add" side="right">
        <Plus />
      </ToolbarButton>
    </Toolbar>
  )
}
