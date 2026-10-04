'use client'

import { BookOpen, Home, Library, Settings, User } from 'lucide-react'
import { Button, Drawer, NavLink, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="Navigation"
      side="start"
      size="sm"
      renderContent={() => (
        <Stack gap="xs">
          <NavLink href="#" label="Home" active icon={<Home />}>
            Home
          </NavLink>
          <NavLink href="#" label="Library" icon={<Library />}>
            Library
          </NavLink>
          <NavLink href="#" label="Reading history" icon={<BookOpen />}>
            Reading history
          </NavLink>
          <NavLink href="#" label="Profile" icon={<User />}>
            Profile
          </NavLink>
          <NavLink href="#" label="Settings" icon={<Settings />}>
            Settings
          </NavLink>
        </Stack>
      )}
    >
      <Button variant="outline" tone="neutral">
        Menu
      </Button>
    </Drawer>
  )
}
