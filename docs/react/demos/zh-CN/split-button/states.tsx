'use client'

import { useState } from 'react'
import { DropdownMenuItem, FormField, SplitButton, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [primaryDisabled, setPrimaryDisabled] = useState(false)
  const [menuDisabled, setMenuDisabled] = useState(false)
  const [result, setResult] = useState('可以分别禁用主操作和菜单')

  return (
    <Stack className="w-full max-w-xs" gap="lg">
      <Stack gap="sm">
        <FormField label="加载中" orientation="horizontal">
          <Switch checked={loading} onCheckedChange={setLoading} />
        </FormField>
        <FormField label="全部禁用" orientation="horizontal">
          <Switch checked={disabled} onCheckedChange={setDisabled} />
        </FormField>
        <FormField label="禁用主操作" orientation="horizontal">
          <Switch checked={primaryDisabled} onCheckedChange={setPrimaryDisabled} />
        </FormField>
        <FormField label="禁用菜单" orientation="horizontal">
          <Switch checked={menuDisabled} onCheckedChange={setMenuDisabled} />
        </FormField>
      </Stack>
      <Stack align="center" gap="sm">
        <SplitButton
          loading={loading}
          disabled={disabled}
          primaryDisabled={primaryDisabled}
          menuDisabled={menuDisabled}
          menuLabel="保存方式"
          onClick={() => setResult('已执行：保存')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('已执行：另存副本')}>
              另存副本
            </DropdownMenuItem>
          )}
        >
          保存修改
        </SplitButton>
        <Text role="status" size="sm" tone="muted">
          {result}
        </Text>
      </Stack>
    </Stack>
  )
}
