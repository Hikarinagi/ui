import { AppShell, NavLink, Sidebar, SidebarGroup, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <AppShell
      className="border-line h-96 w-full rounded-lg border"
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="概览">
            概览
          </NavLink>
          <SidebarGroup label="作品库">
            <NavLink href="#" label="Galgame">
              Galgame
            </NavLink>
            <NavLink href="#" label="轻小说">
              轻小说
            </NavLink>
          </SidebarGroup>
          <SidebarGroup label="创作" defaultOpen={false}>
            <NavLink href="#" label="我的条目">
              我的条目
            </NavLink>
            <NavLink href="#" label="草稿箱">
              草稿箱
            </NavLink>
          </SidebarGroup>
        </Sidebar>
      }
    >
      <Text size="sm" tone="muted" className="block p-6">
        「创作」一组默认收起。
      </Text>
    </AppShell>
  )
}
