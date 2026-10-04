import { Center, ContextMenu, ContextMenuItem, ContextMenuSub, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <ContextMenu
      label="Share"
      content={
        <>
          <ContextMenuItem>Copy link</ContextMenuItem>
          <ContextMenuSub label="Share to">
            <ContextMenuItem>Feed</ContextMenuItem>
            <ContextMenuItem>Direct message</ContextMenuItem>
            <ContextMenuSub label="More">
              <ContextMenuItem>Email</ContextMenuItem>
              <ContextMenuItem>QR code</ContextMenuItem>
            </ContextMenuSub>
          </ContextMenuSub>
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
