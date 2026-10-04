'use client'

import { useState } from 'react'
import { Card, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(true)

  return (
    <Stack gap="md" align="start">
      <Switch checked={loading} onCheckedChange={setLoading}>
        显示遮罩
      </Switch>
      <Card className="relative w-96">
        <Text>这块内容在加载期间被压淡，也不能点击。</Text>
        <LoadingOverlay visible={loading} />
      </Card>
    </Stack>
  )
}
