'use client'

import { Avatar, Button, Dialog, Inline, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="Edit profile"
      description="Changes sync to your homepage right away."
      renderContent={() => (
        <Stack gap="sm">
          <Inline gap="sm">
            <Avatar size="lg" src="/avatars/glass.webp" alt="Shion Hoshimi" />
            <Button size="sm" variant="soft" tone="neutral">
              Change picture
            </Button>
          </Inline>
          <Stack gap="xs">
            <Text size="sm">Display name</Text>
            <Input defaultValue="Shion Hoshimi" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">Bio</Text>
            <Input defaultValue="A travelling merchant and a girl who calls herself a harvest deity." />
          </Stack>
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Edit profile
      </Button>
    </Dialog>
  )
}
