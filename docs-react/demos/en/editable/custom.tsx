'use client'

import { Button, Editable, FormField, Stack, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <FormField label="Release version">
        <Editable
          defaultValue="1.8.0"
          activationMode="manual"
          submitMode="manual"
          renderPreview={({ value }) => <Tag tone="info">v{value}</Tag>}
          renderActions={({ editing, saving, edit, submit, cancel }) =>
            editing ? (
              <>
                <Button size="sm" loading={saving} onClick={submit}>
                  Save version
                </Button>
                <Button size="sm" variant="ghost" tone="neutral" disabled={saving} onClick={cancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" tone="neutral" onClick={edit}>
                Edit version
              </Button>
            )
          }
        />
      </FormField>
    </Stack>
  )
}
