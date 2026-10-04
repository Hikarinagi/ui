'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Center, FloatButton, FormField, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [result, setResult] = useState('Visibility changes include a transition')

  return (
    <Stack className="w-full max-w-xs">
      <FormField label="Show button" orientation="horizontal">
        <Switch checked={visible} onCheckedChange={setVisible} />
      </FormField>
      <FormField label="Loading" orientation="horizontal">
        <Switch checked={loading} onCheckedChange={setLoading} />
      </FormField>
      <FormField label="Disabled" orientation="horizontal">
        <Switch checked={disabled} onCheckedChange={setDisabled} />
      </FormField>
      <Center className="h-24">
        <FloatButton
          position="static"
          label="Sync profile"
          visible={visible}
          loading={loading}
          disabled={disabled}
          onClick={() => setResult('Action: Sync profile')}
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
