import { AppShell, Heading, NavLink, Sidebar, Stack, Text } from '@hina-ui/react'

const paragraphs = Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1}.`)

export default function Demo() {
  return (
    <AppShell
      className="border-line h-72 w-full rounded-lg border"
      sidebarContent={
        <Sidebar>
          <NavLink href="#" active label="Body">
            Body
          </NavLink>
          <NavLink href="#" label="Notes">
            Notes
          </NavLink>
        </Sidebar>
      }
      header={
        <Heading level={2} size="sm">
          The header does not scroll with the content
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
