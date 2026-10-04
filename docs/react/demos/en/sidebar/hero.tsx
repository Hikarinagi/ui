'use client'

import { useState } from 'react'
import { FileText, House, Images, Settings } from 'lucide-react'
import {
  AppShell,
  Avatar,
  Heading,
  Inline,
  NavLink,
  Sidebar,
  SidebarGroup,
  SidebarLabel,
  SidebarTrigger,
  Stack,
  Text,
} from '@hina-ui/react'

const groups = [
  {
    label: 'Content',
    items: [
      { id: 'overview', label: 'Overview', icon: House },
      { id: 'articles', label: 'Articles', icon: FileText },
      { id: 'library', label: 'Media library', icon: Images },
    ],
  },
  { label: 'Manage', items: [{ id: 'settings', label: 'Settings', icon: Settings }] },
]

export default function Demo() {
  const [selected, setSelected] = useState('overview')
  return (
    <AppShell
      mobileTitle="Hina UI"
      className="border-line h-112 w-full rounded-lg border"
      sidebarContent={
        <Sidebar
          renderIcon={() => <Avatar src="/favicon.png" name="Hina UI" className="rounded-md" />}
          renderWordmark={() => (
            <Stack gap="none">
              <Text weight="medium" className="truncate">
                Hina UI
              </Text>
              <Text size="xs" tone="muted" className="truncate">
                Workspace
              </Text>
            </Stack>
          )}
          renderFooter={() => (
            <Inline gap="sm" align="center" wrap={false}>
              <Avatar src="/avatars/paper.webp" name="Shion Hoshimi" />
              <SidebarLabel as="div" className="flex-1">
                <Stack gap="none">
                  <Text size="sm" weight="medium" className="truncate">
                    Shion Hoshimi
                  </Text>
                  <Text size="xs" tone="muted" className="truncate">
                    Administrator
                  </Text>
                </Stack>
              </SidebarLabel>
            </Inline>
          )}
        >
          {groups.map(group => (
            <SidebarGroup key={group.label} label={group.label}>
              {group.items.map(item => (
                <NavLink
                  key={item.id}
                  href={`#${item.id}`}
                  label={item.label}
                  active={selected === item.id}
                  icon={<item.icon />}
                  onClick={event => {
                    event.preventDefault()
                    setSelected(item.id)
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </SidebarGroup>
          ))}
        </Sidebar>
      }
      header={
        <>
          <SidebarTrigger />
          <Heading level={2} size="sm" className="truncate">
            Creator workspace
          </Heading>
        </>
      }
    >
      <Stack gap="sm" className="p-6">
        <Heading level={3} size="sm">
          {groups.flatMap(group => group.items).find(item => item.id === selected)?.label}
        </Heading>
        <Text size="sm" tone="muted">
          Toggle the sidebar to see the logo, groups and footer stay in place. On narrow screens,
          the button opens the drawer.
        </Text>
      </Stack>
    </AppShell>
  )
}
