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
    <Toolbar label="Text tools" size="sm">
      <ToolbarButton label="Undo">
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton label="Redo" disabled>
        <Redo2 />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup
        value={formats}
        onValueChange={setFormats}
        type="multiple"
        label="Formatting"
      >
        <ToolbarToggleItem value="bold" label="Bold">
          <Bold />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" label="Italic">
          <Italic />
        </ToolbarToggleItem>
        <ToolbarToggleItem value="underline" label="Underline">
          <Underline />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
    </Toolbar>
  )
}
