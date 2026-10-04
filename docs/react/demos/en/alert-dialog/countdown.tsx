import { AlertDialog, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <AlertDialog
      title="Confirm action?"
      description="The confirm button becomes available when the countdown ends."
      tone="danger"
      confirmText="Confirm"
      confirmDelay={3}
    >
      <Button variant="outline" tone="neutral">
        Confirmation countdown
      </Button>
    </AlertDialog>
  )
}
