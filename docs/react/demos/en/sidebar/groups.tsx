import { AppShell, NavLink, Sidebar, SidebarGroup, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <AppShell
      className="border-line h-96 w-full rounded-lg border"
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="Overview">
            Overview
          </NavLink>
          <SidebarGroup label="Library">
            <NavLink href="#" label="Galgame">
              Galgame
            </NavLink>
            <NavLink href="#" label="Light novels">
              Light novels
            </NavLink>
          </SidebarGroup>
          <SidebarGroup label="Creating" defaultOpen={false}>
            <NavLink href="#" label="My entries">
              My entries
            </NavLink>
            <NavLink href="#" label="Drafts">
              Drafts
            </NavLink>
          </SidebarGroup>
        </Sidebar>
      }
    >
      <Text size="sm" tone="muted" className="block p-6">
        The “Creating” group starts collapsed.
      </Text>
    </AppShell>
  )
}
