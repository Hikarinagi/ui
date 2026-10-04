import { Button, Result } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      status="success"
      title="Review published"
      description="Other readers can see it now."
      className="w-96"
      actions={
        <>
          <Button size="sm">View review</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            Back to shelf
          </Button>
        </>
      }
    />
  )
}
