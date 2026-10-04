'use client'

import { useState } from 'react'
import { Editable, FormField, Stack, Switch, Text } from '@hina-ui/react'

export default function Demo() {
  const [name, setName] = useState('Creator workspace')
  const [fail, setFail] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(value: string) {
    setSaved(false)
    if (!value.trim()) throw new Error('Enter a workspace name')
    await new Promise(resolve => setTimeout(resolve, 800))
    if (fail) throw new Error('Could not save. Disable the simulated failure and try again.')
    setSaved(true)
  }

  return (
    <Stack className="w-full max-w-sm">
      <FormField
        label="Workspace name"
        description="Stay in edit mode while saving. A failed save keeps the draft for retry."
      >
        <Editable value={name} onValueChange={setName} onSave={save} submitMode="enter" />
      </FormField>
      <FormField label="Simulate a failed save" orientation="horizontal">
        <Switch checked={fail} onCheckedChange={setFail} />
      </FormField>
      {saved && (
        <Text role="status" size="sm" tone="muted">
          Workspace name saved.
        </Text>
      )}
    </Stack>
  )
}
