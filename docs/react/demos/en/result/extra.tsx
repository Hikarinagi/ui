import { Button, Code, Result, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Result
      status="success"
      title="Order placed"
      description="We will notify you when it ships."
      className="w-96"
      actions={
        <Button size="sm" variant="soft" tone="neutral">
          View order
        </Button>
      }
    >
      <Text size="sm" tone="muted">
        Order <Code>HN-20260907-0412</Code>
      </Text>
    </Result>
  )
}
