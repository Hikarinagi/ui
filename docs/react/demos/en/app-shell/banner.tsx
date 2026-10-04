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
          Hina UI 1.2 is out.
          <Link href="#" underline>
            Read the release notes
          </Link>
        </Banner>
      }
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="Home">
            Home
          </NavLink>
          <NavLink href="#" label="My shelf">
            My shelf
          </NavLink>
        </Sidebar>
      }
      header={
        <>
          <SidebarTrigger />
          <Heading level={2} size="sm">
            Home
          </Heading>
        </>
      }
    >
      <Text size="sm" tone="muted" className="block p-6">
        Close the banner and the sidebar and main area move up to fill the space.
      </Text>
    </AppShell>
  )
}
