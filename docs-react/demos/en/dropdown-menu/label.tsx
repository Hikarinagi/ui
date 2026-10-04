import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <DropdownMenu
      label="Account"
      content={
        <>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Preferences</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuItem>Members</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </>
      }
    >
      <Button
        variant="outline"
        tone="neutral"
        icon={<Avatar size="sm" src="/avatars/huh.webp" alt="Shion Hoshimi" />}
      >
        Shion Hoshimi
      </Button>
    </DropdownMenu>
  )
}
