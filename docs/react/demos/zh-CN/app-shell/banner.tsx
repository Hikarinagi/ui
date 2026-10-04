import {
  AppShell,
  Banner,
  Heading,
  Link,
  NavLink,
  Sidebar,
  SidebarTrigger,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <AppShell
      collapsible="hidden"
      className="border-line h-96 w-full rounded-lg border"
      banner={
        <Banner closable>
          Hina UI 1.2 已发布。
          <Link href="#" underline>
            查看更新说明
          </Link>
        </Banner>
      }
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="首页">
            首页
          </NavLink>
          <NavLink href="#" label="我的书架">
            我的书架
          </NavLink>
        </Sidebar>
      }
      header={
        <>
          <SidebarTrigger />
          <Heading level={2} size="sm">
            首页
          </Heading>
        </>
      }
    >
      <Text size="sm" tone="muted" className="block p-6">
        关闭公告条后，侧栏与主区域一起上移补满。
      </Text>
    </AppShell>
  )
}
