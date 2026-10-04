'use client'

import { useState } from 'react'
import { Button, Inline, Input, Stack, Switch, Text, Tooltip } from '@hina-ui/react'

export default function Demo() {
  const [content, setContent] = useState('提示文字')
  const [disabled, setDisabled] = useState(false)
  return (
    <Stack align="start">
      <Inline>
        <Tooltip content="直接绑定已有元素">
          <Button variant="outline" tone="neutral">
            字符串
          </Button>
        </Tooltip>
        <Tooltip content={content} side="bottom" disabled={disabled}>
          <Button variant="outline" tone="neutral">
            对象配置
          </Button>
        </Tooltip>
      </Inline>
      <Input value={content} onValueChange={setContent} aria-label="提示文字" className="w-64" />
      <Inline>
        <Switch checked={disabled} onCheckedChange={setDisabled} aria-label="禁用对象提示" />
        <Text>禁用对象提示</Text>
      </Inline>
    </Stack>
  )
}
