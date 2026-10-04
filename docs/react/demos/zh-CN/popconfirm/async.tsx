'use client'

import { useState } from 'react'
import { Button, Popconfirm, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [fail, setFail] = useState(false)
  const [status, setStatus] = useState('')

  async function retry() {
    setStatus('')
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (fail) {
      setStatus('重试失败，请稍后再试。')
      throw new Error('retry failed')
    }
    setStatus('已重新发送。')
  }

  return (
    <Stack gap="md" align="start">
      <Switch checked={fail} onCheckedChange={setFail}>
        模拟失败
      </Switch>
      <Popconfirm
        title="重新发送这封邮件？"
        confirmText="重发"
        onConfirm={retry}
        content={
          status ? (
            <Text tone="muted" size="sm">
              {status}
            </Text>
          ) : null
        }
      >
        <Button variant="outline" tone="neutral">
          重新发送
        </Button>
      </Popconfirm>
    </Stack>
  )
}
