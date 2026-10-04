import { Alert, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <Alert
      tone="info"
      title="New comments"
      className="w-full max-w-xl"
      actions={
        <>
          <Button size="sm" variant="soft" tone="neutral">
            Later
          </Button>
          <Button size="sm">View</Button>
        </>
      }
    >
      Your article has received 3 new comments.
    </Alert>
  )
}
