'use client'

import { useState } from 'react'
import { Button, Card, LoadingOverlay, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)

  async function reload() {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1800))
    setLoading(false)
  }

  return (
    <Stack gap="sm" align="start">
      <Card className="relative w-96">
        <Stack gap="xs">
          <Text weight="medium">本周新增</Text>
          <Text tone="muted" size="sm">
            收藏 128 次，评论 32 条，新粉丝 12 位。
          </Text>
        </Stack>
        <LoadingOverlay visible={loading} text="正在刷新" />
      </Card>
      <Button variant="outline" tone="neutral" disabled={loading} onClick={reload}>
        刷新
      </Button>
    </Stack>
  )
}
