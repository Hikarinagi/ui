import { Center, ContextMenu, ContextMenuItem, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <ContextMenu
      label="Image actions"
      content={
        <>
          <ContextMenuItem>Open in new tab</ContextMenuItem>
          <ContextMenuItem>Copy image address</ContextMenuItem>
          <ContextMenuItem>Save image</ContextMenuItem>
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
