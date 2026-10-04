import { AppShell, NavLink, Sidebar, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <AppShell
      className="border-line h-64 w-full rounded-lg border"
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="概览">
            概览
          </NavLink>
          <NavLink href="#" label="我的书架">
            我的书架
          </NavLink>
          <NavLink href="#" label="收藏">
            收藏
          </NavLink>
        </Sidebar>
      }
    >
      <Text size="sm" tone="muted" className="block p-6">
        侧栏条目放在默认插槽里。
      </Text>
    </AppShell>
  )
}
