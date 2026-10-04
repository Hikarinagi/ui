import { Center, ContextMenu, ContextMenuItem, ContextMenuSub, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <ContextMenu
      label="分享"
      content={
        <>
          <ContextMenuItem>复制链接</ContextMenuItem>
          <ContextMenuSub label="分享到">
            <ContextMenuItem>动态</ContextMenuItem>
            <ContextMenuItem>私信</ContextMenuItem>
            <ContextMenuSub label="更多">
              <ContextMenuItem>邮件</ContextMenuItem>
              <ContextMenuItem>二维码</ContextMenuItem>
            </ContextMenuSub>
          </ContextMenuSub>
        </>
      }
    >
      <Center className="bg-inset h-32 w-96 rounded-lg border border-dashed select-none">
        <Text tone="muted" size="sm">
          在这里点击右键
        </Text>
      </Center>
    </ContextMenu>
  )
}
