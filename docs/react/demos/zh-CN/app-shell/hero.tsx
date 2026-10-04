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
    label: '内容',
    items: [
      { id: 'overview', label: '概览', icon: House },
      { id: 'articles', label: '文章', icon: FileText },
      { id: 'library', label: '媒体库', icon: Images },
    ],
  },
  { label: '管理', items: [{ id: 'settings', label: '设置', icon: Settings }] },
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
                工作空间
              </Text>
            </Stack>
          )}
          renderFooter={() => (
            <Inline gap="sm" align="center" wrap={false}>
              <Avatar src="/avatars/paper.webp" name="星见书音" />
              <SidebarLabel as="div" className="flex-1">
                <Stack gap="none">
                  <Text size="sm" weight="medium" className="truncate">
                    星见书音
                  </Text>
                  <Text size="xs" tone="muted" className="truncate">
                    管理员
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
            创作者中心
          </Heading>
        </>
      }
    >
      <Stack gap="sm" className="p-6">
        <Heading level={3} size="sm">
          {groups.flatMap(group => group.items).find(item => item.id === selected)?.label}
        </Heading>
        <Text size="sm" tone="muted">
          切换侧栏，观察标识、分组与页脚的位置。窄屏时打开抽屉。
        </Text>
      </Stack>
    </AppShell>
  )
}
