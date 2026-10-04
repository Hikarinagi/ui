import { Alert, Button, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="min-h-48 w-full max-w-xl">
      <Alert tone="success" title="Published" closable>
        The article is now visible to everyone.
      </Alert>
      <Alert
        tone="danger"
        title="Publishing failed"
        actions={
          <Button size="sm" variant="soft" tone="danger">
            Retry
          </Button>
        }
      >
        The server is not responding for now; your draft has been kept.
      </Alert>
    </Stack>
  )
}
