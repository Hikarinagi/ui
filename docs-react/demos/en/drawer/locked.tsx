'use client'

import { useState } from 'react'
import { Button, Drawer, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      title="Edit tags"
      description="Please keep this drawer open while it saves."
      locked={saving}
      renderContent={() => (
        <Text>
          {saving
            ? 'Saving. It closes on its own in two seconds.'
            : 'Saving locks the drawer for two seconds.'}
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
        Edit tags
      </Button>
    </Drawer>
  )
}
