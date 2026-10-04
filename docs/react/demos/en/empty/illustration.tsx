import { Button, Empty, Image } from '@hina-ui/react'

export default function Demo() {
  return (
    <Empty
      title="Your inbox is empty"
      description="New notifications land here first."
      className="w-96"
      icon={<Image src="/avatars/peek.webp" ratio={1} className="size-24 rounded-full" />}
      actions={
        <Button size="sm" variant="soft" tone="neutral">
          Notification settings
        </Button>
      }
    />
  )
}
