import { Copy, Pencil, Trash2 } from 'lucide-react'
import {
  Center,
  ContextMenu,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  Kbd,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <ContextMenu
      label="Note actions"
      content={
        <>
          <ContextMenuLabel>This note</ContextMenuLabel>
          <ContextMenuItem icon={<Pencil />} trailing={<Kbd>E</Kbd>}>
            Edit
          </ContextMenuItem>
          <ContextMenuItem icon={<Copy />} trailing={<Kbd>⌘C</Kbd>}>
            Copy
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem tone="danger" icon={<Trash2 />}>
            Delete
          </ContextMenuItem>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          Right-click here
        </Text>
      </Center>
    </ContextMenu>
  )
}
