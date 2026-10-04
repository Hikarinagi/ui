import { Button, Empty } from '@hina-ui/react'

export default function Demo() {
  return (
    <Empty
      title="No lists yet"
      description="Gather the books you want to read together."
      className="w-96"
      actions={
        <>
          <Button size="sm">New list</Button>
          <Button size="sm" variant="ghost" tone="neutral">
            About lists
          </Button>
        </>
      }
    />
  )
}
