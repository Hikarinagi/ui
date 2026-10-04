import { Button, Result } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      status="error"
      title="Payment not completed"
      description="The bank did not confirm the transaction; nothing was charged."
      className="w-96"
      actions={
        <>
          <Button size="sm">Pay again</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            Contact support
          </Button>
        </>
      }
    />
  )
}
