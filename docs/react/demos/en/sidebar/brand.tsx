'use client'

import { House } from 'lucide-react'
import { AppShell, Image, NavLink, Sidebar, SidebarTrigger, Stack, Text } from '@hina-ui/react'
import { Wordmark } from '../../../components/Wordmark'

const examples = [
  { mode: 'both', label: 'Icon and wordmark' },
  { mode: 'wordmark', label: 'Wordmark only' },
  { mode: 'icon', label: 'Icon only' },
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
                  label="Overview"
                  icon={<House />}
                  onClick={event => event.preventDefault()}
                >
                  Overview
                </NavLink>
              </Sidebar>
            }
            header={
              <>
                <SidebarTrigger />
                <Text size="sm" weight="medium">
                  Brand slots
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
