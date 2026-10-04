'use client'

import { useState } from 'react'
import { DropdownMenuItem, FormField, SplitButton, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [primaryDisabled, setPrimaryDisabled] = useState(false)
  const [menuDisabled, setMenuDisabled] = useState(false)
  const [result, setResult] = useState('Disable either action independently')

  return (
    <Stack className="w-full max-w-xs" gap="lg">
      <Stack gap="sm">
        <FormField label="Loading" orientation="horizontal">
          <Switch checked={loading} onCheckedChange={setLoading} />
        </FormField>
        <FormField label="Disable both" orientation="horizontal">
          <Switch checked={disabled} onCheckedChange={setDisabled} />
        </FormField>
        <FormField label="Disable primary action" orientation="horizontal">
          <Switch checked={primaryDisabled} onCheckedChange={setPrimaryDisabled} />
        </FormField>
        <FormField label="Disable menu" orientation="horizontal">
          <Switch checked={menuDisabled} onCheckedChange={setMenuDisabled} />
        </FormField>
      </Stack>
      <Stack align="center" gap="sm">
        <SplitButton
          loading={loading}
          disabled={disabled}
          primaryDisabled={primaryDisabled}
          menuDisabled={menuDisabled}
          menuLabel="Save options"
          onClick={() => setResult('Action: save')}
          renderContent={() => (
            <DropdownMenuItem onSelect={() => setResult('Action: save a copy')}>
              Save a copy
            </DropdownMenuItem>
          )}
        >
          Save changes
        </SplitButton>
        <Text role="status" size="sm" tone="muted">
          {result}
        </Text>
      </Stack>
    </Stack>
  )
}
