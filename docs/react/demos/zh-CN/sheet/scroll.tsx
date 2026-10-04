'use client'

import { Button, Sheet, Stack, Text } from '@hina-ui/react'

const clauses = Array.from({ length: 24 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <Sheet
      title="用户协议"
      description="请阅读全文后再同意。"
      renderContent={() => (
        <Stack gap="md">
          {clauses.map(n => (
            <Text key={n}>
              第 {n} 条：本条款用于演示面板内部的滚动，标题与页脚保持不动，正文在中间滚动。
            </Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => <Button onClick={close}>同意</Button>}
    >
      <Button variant="outline" tone="neutral">
        查看协议
      </Button>
    </Sheet>
  )
}
