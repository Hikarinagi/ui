'use client'

import { useState } from 'react'
import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function submit() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setOpen(false)
    }, 2000)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Import a library"
      description="Please keep this dialog open while the import runs."
      locked={submitting}
      renderContent={() => (
        <Text>
          {submitting
            ? 'Importing. It closes on its own in two seconds.'
            : 'Starting the import locks the dialog for two seconds.'}
        </Text>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" disabled={submitting} onClick={close}>
            Cancel
          </Button>
          <Button loading={submitting} onClick={submit}>
            Start import
          </Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Import
      </Button>
    </Dialog>
  )
}
