'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Center, FloatButton, FormField, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [result, setResult] = useState('显示和隐藏带有过渡')

  return (
    <Stack className="w-full max-w-xs">
      <FormField label="显示按钮" orientation="horizontal">
        <Switch checked={visible} onCheckedChange={setVisible} />
      </FormField>
      <FormField label="加载中" orientation="horizontal">
        <Switch checked={loading} onCheckedChange={setLoading} />
      </FormField>
      <FormField label="禁用" orientation="horizontal">
        <Switch checked={disabled} onCheckedChange={setDisabled} />
      </FormField>
      <Center className="h-24">
        <FloatButton
          position="static"
          label="同步资料"
          visible={visible}
          loading={loading}
          disabled={disabled}
          onClick={() => setResult('已执行：同步资料')}
        >
          <RefreshCw />
        </FloatButton>
      </Center>
      <Text role="status" size="sm" tone="muted" className="text-center">
        {result}
      </Text>
    </Stack>
  )
}
