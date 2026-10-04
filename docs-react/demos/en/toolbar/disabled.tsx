'use client'

import { useState } from 'react'
import { Bold, Italic, Undo2, Redo2 } from 'lucide-react'
import {
  Toolbar,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  Stack,
  FormField,
  Switch,
} from '@hina-ui/react'

export default function Demo() {
  const [disabled, setDisabled] = useState(false)
  const [groupDisabled, setGroupDisabled] = useState(false)
  const [formats, setFormats] = useState(['bold'])

  return (
    <Stack align="start">
      <FormField label="Disable all" orientation="horizontal">
        <Switch checked={disabled} onCheckedChange={setDisabled} />
      </FormField>
      <FormField label="Disable toggle group" orientation="horizontal">
        <Switch checked={groupDisabled} onCheckedChange={setGroupDisabled} />
      </FormField>
      <Toolbar label="Disabled state" disabled={disabled} size="sm">
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
          disabled={groupDisabled}
        >
          <ToolbarToggleItem value="bold" label="Bold">
            <Bold />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" label="Italic">
            <Italic />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    </Stack>
  )
}
