'use client'

import { Button, Dialog, Stack, Text } from '@hina-ui/react'

const terms = Array.from(
  { length: 30 },
  (_, i) =>
    `第 ${i + 1} 条：使用本服务即表示你同意这一条款，它在这里只用于占位，好让正文足够长，能够看到滚动。`,
)

export default function Demo() {
  return (
    <Dialog
      title="服务条款"
      description="请阅读之后再继续。"
      renderContent={() => (
        <Stack gap="sm">
          {terms.map(line => (
            <Text key={line}>{line}</Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            拒绝
          </Button>
          <Button onClick={close}>同意</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        查看条款
      </Button>
    </Dialog>
  )
}
