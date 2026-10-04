import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="账户"
      content={
        <>
          <DropdownMenuGroup>
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuItem>个人资料</DropdownMenuItem>
            <DropdownMenuItem>偏好设置</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>工作区</DropdownMenuLabel>
            <DropdownMenuItem>成员</DropdownMenuItem>
            <DropdownMenuItem>计费</DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      }
    >
      <Button
        variant="outline"
        tone="neutral"
        icon={<Avatar size="sm" src="/avatars/huh.webp" alt="星见书音" />}
      >
        星见书音
      </Button>
    </DropdownMenu>
  )
}
