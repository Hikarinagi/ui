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
      <FormField label="禁用全部" orientation="horizontal">
        <Switch checked={disabled} onCheckedChange={setDisabled} />
      </FormField>
      <FormField label="禁用切换组" orientation="horizontal">
        <Switch checked={groupDisabled} onCheckedChange={setGroupDisabled} />
      </FormField>
      <Toolbar label="禁用状态" disabled={disabled} size="sm">
        <ToolbarButton label="撤销">
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton label="重做" disabled>
          <Redo2 />
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarToggleGroup
          value={formats}
          onValueChange={setFormats}
          type="multiple"
          label="格式"
          disabled={groupDisabled}
        >
          <ToolbarToggleItem value="bold" label="加粗">
            <Bold />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" label="斜体">
            <Italic />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    </Stack>
  )
}
