'use client'

import { useState } from 'react'
import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    setOpen(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title="Save changes"
      description="The sheet stays put while saving."
      locked={saving}
      renderContent={() => (
        <Text>
          For a second and a half after pressing Save, dragging, Esc and the scrim do nothing.
        </Text>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" disabled={saving} onClick={close}>
            Cancel
          </Button>
          <Button loading={saving} onClick={save}>
            Save
          </Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Open
      </Button>
    </Sheet>
  )
}
