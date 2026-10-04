'use client'

import { House } from 'lucide-react'
import { AppShell, Image, NavLink, Sidebar, SidebarTrigger, Stack, Text } from '@hina-ui/react'
import { Wordmark } from '../../../components/Wordmark'

const examples = [
  { mode: 'both', label: '图标与字标' },
  { mode: 'wordmark', label: '只有字标' },
  { mode: 'icon', label: '只有图标' },
]

export default function Demo() {
  return (
    <Stack gap="lg" className="w-full">
      {examples.map(example => (
        <Stack key={example.mode} gap="sm">
          <Text size="sm" tone="muted">
            {example.label}
          </Text>
          <AppShell
            mobileTitle="Hina UI"
            className="border-line h-52 w-full rounded-lg border"
            sidebarContent={
              <Sidebar
                renderIcon={
                  example.mode !== 'wordmark'
                    ? () => <Image src="/favicon.png" alt="Hina UI" className="rounded-md" />
                    : undefined
                }
                renderWordmark={
                  example.mode !== 'icon' ? () => <Wordmark className="items-center" /> : undefined
                }
              >
                <NavLink
                  href="#"
                  active
                  label="概览"
                  icon={<House />}
                  onClick={event => event.preventDefault()}
                >
                  概览
                </NavLink>
              </Sidebar>
            }
            header={
              <>
                <SidebarTrigger />
                <Text size="sm" weight="medium">
                  品牌插槽
                </Text>
              </>
            }
          >
            <Text size="sm" tone="muted" className="block p-6">
              {example.label}
            </Text>
          </AppShell>
        </Stack>
      ))}
    </Stack>
  )
}
