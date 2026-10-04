import { AlertDialog, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <AlertDialog
      title="Delete your account?"
      description="The account and all of its data are deleted permanently after 30 days; signing in before then cancels it."
      tone="danger"
      confirmText="Delete account"
    >
      <Button variant="outline" tone="danger">
        Delete account
      </Button>
    </AlertDialog>
  )
}
