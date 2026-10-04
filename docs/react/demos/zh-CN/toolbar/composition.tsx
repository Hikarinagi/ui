'use client'

import { useState } from 'react'
import { Bold, Copy, Ellipsis, Trash2 } from 'lucide-react'
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Toggle,
  DropdownMenu,
  DropdownMenuItem,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [bold, setBold] = useState(false)
  const [action, setAction] = useState('尚未执行')

  return (
    <Stack align="start" gap="sm">
      <Toolbar label="组合控件" size="sm">
        <ToolbarButton asChild>
          <Toggle
            value={bold}
            onValueChange={setBold}
            label="加粗"
            size="sm"
            renderIcon={() => <Bold />}
          />
        </ToolbarButton>
        <ToolbarButton label="复制" onClick={() => setAction('复制')}>
          <Copy />
        </ToolbarButton>
        <ToolbarSeparator />
        <DropdownMenu
          label="更多操作"
          content={
            <>
              <DropdownMenuItem onSelect={() => setAction('复制')} icon={<Copy />}>
                复制
              </DropdownMenuItem>
              <DropdownMenuItem tone="danger" onSelect={() => setAction('删除')} icon={<Trash2 />}>
                删除
              </DropdownMenuItem>
            </>
          }
        >
          <ToolbarButton label="更多">
            <Ellipsis />
          </ToolbarButton>
        </DropdownMenu>
      </Toolbar>
      <Text size="sm" tone="muted" aria-live="polite">
        {action}
      </Text>
    </Stack>
  )
}
