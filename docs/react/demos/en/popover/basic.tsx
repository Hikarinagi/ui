import { Button, Popover, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popover
      content={
        <Text size="sm">
          ATRI, published by ANIPLEX.EXE, follows a girl who restarts an observation programme at an
          abandoned observatory.
        </Text>
      }
    >
      <Button variant="outline" tone="neutral">
        About this book
      </Button>
    </Popover>
  )
}
