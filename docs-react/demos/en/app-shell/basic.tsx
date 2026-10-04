import { AppShell, NavLink, Sidebar, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <AppShell
      className="border-line h-72 w-full rounded-lg border"
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="Overview">
            Overview
          </NavLink>
          <NavLink href="#" label="My shelf">
            My shelf
          </NavLink>
        </Sidebar>
      }
    >
      <Text size="sm" tone="muted" className="block p-6">
        Main content goes in the default slot.
      </Text>
    </AppShell>
  )
}
