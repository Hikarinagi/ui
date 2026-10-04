'use client'

import { Avatar, Button, Dialog, Inline, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="编辑资料"
      description="改动会立刻同步到你的主页。"
      renderContent={() => (
        <Stack gap="sm">
          <Inline gap="sm">
            <Avatar size="lg" src="/avatars/glass.webp" alt="星见书音" />
            <Button size="sm" variant="soft" tone="neutral">
              更换头像
            </Button>
          </Inline>
          <Stack gap="xs">
            <Text size="sm">昵称</Text>
            <Input defaultValue="星见书音" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">简介</Text>
            <Input defaultValue="行商人与自称丰收之神的少女同行的旅途。" />
          </Stack>
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            取消
          </Button>
          <Button onClick={close}>保存</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        编辑资料
      </Button>
    </Dialog>
  )
}
