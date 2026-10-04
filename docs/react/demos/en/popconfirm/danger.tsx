import { Button, Popconfirm } from '@hina-ui/react'

export default function Demo() {
  return (
    <Popconfirm
      title="Remove this member?"
      description="They will lose access to this project."
      tone="danger"
      confirmText="Remove"
    >
      <Button variant="outline" tone="danger">
        Remove member
      </Button>
    </Popconfirm>
  )
}
