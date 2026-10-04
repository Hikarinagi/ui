import { AppShell, Heading, NavLink, Sidebar, Stack, Text } from '@hina-ui/react'

const paragraphs = Array.from({ length: 12 }, (_, i) => `第 ${i + 1} 段正文。`)

export default function Demo() {
  return (
    <AppShell
      className="border-line h-72 w-full rounded-lg border"
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="正文">
            正文
          </NavLink>
          <NavLink href="#" label="注释">
            注释
          </NavLink>
        </Sidebar>
      }
      header={
        <Heading level={2} size="sm">
          标题栏不随内容滚动
        </Heading>
      }
    >
      <Stack gap="sm" className="p-6">
        {paragraphs.map(p => (
          <Text key={p} size="sm" tone="muted">
            {p}
          </Text>
        ))}
      </Stack>
    </AppShell>
  )
}
