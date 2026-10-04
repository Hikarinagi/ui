'use client'

import { useState } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [formats, setFormats] = useState(['bold'])
  const [alignment, setAlignment] = useState<string | undefined>('start')

  return (
    <Stack align="start" gap="sm">
      <Toolbar label="切换组" size="sm">
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
        <ToolbarSeparator />
        <ToolbarToggleGroup value={alignment} onValueChange={setAlignment} label="对齐">
          <ToolbarToggleItem value="start" label="起始对齐">
            <AlignLeft />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="center" label="居中">
            <AlignCenter />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="end" label="末尾对齐">
            <AlignRight />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
      <Text size="sm" tone="muted">
        格式：{formats.join(', ') || '无'} · 对齐：{alignment ?? '无'}
      </Text>
    </Stack>
  )
}
