'use client'

import { useState } from 'react'
import { Copy, FolderInput, Pencil, Trash2 } from 'lucide-react'
import {
  Center,
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [last, setLast] = useState('')

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      <ContextMenu
        label="File actions"
        content={
          <>
            <ContextMenuItem icon={<Pencil />} onSelect={() => setLast('Rename')}>
              Rename
            </ContextMenuItem>
            <ContextMenuItem icon={<Copy />} onSelect={() => setLast('Copy')}>
              Copy
            </ContextMenuItem>
            <ContextMenuSub label="Move to" icon={<FolderInput />}>
              <ContextMenuItem onSelect={() => setLast('Move to Favorites')}>
                Favorites
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => setLast('Move to Archive')}>Archive</ContextMenuItem>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem tone="danger" icon={<Trash2 />} onSelect={() => setLast('Delete')}>
              Delete
            </ContextMenuItem>
          </>
        }
      >
        <Center className="bg-inset h-32 rounded-lg border border-dashed select-none">
          <Text tone="muted" size="sm">
            Right-click here
          </Text>
        </Center>
      </ContextMenu>
      {last && (
        <Text tone="muted" size="sm">
          Picked: {last}
        </Text>
      )}
    </Stack>
  )
}
