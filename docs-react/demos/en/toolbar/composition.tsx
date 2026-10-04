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
  const [action, setAction] = useState('No action yet')

  return (
    <Stack align="start" gap="sm">
      <Toolbar label="Composed controls" size="sm">
        <ToolbarButton asChild>
          <Toggle
            value={bold}
            onValueChange={setBold}
            label="Bold"
            size="sm"
            renderIcon={() => <Bold />}
          />
        </ToolbarButton>
        <ToolbarButton label="Copy" onClick={() => setAction('Copy')}>
          <Copy />
        </ToolbarButton>
        <ToolbarSeparator />
        <DropdownMenu
          label="More actions"
          content={
            <>
              <DropdownMenuItem onSelect={() => setAction('Copy')} icon={<Copy />}>
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem
                tone="danger"
                onSelect={() => setAction('Delete')}
                icon={<Trash2 />}
              >
                Delete
              </DropdownMenuItem>
            </>
          }
        >
          <ToolbarButton label="More">
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
