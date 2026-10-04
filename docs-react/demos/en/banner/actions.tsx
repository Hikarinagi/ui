import { Banner, Button } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner
      tone="warning"
      actions={
        <Button size="sm" tone="neutral">
          Stay signed in
        </Button>
      }
    >
      Your session expires in 5 minutes.
    </Banner>
  )
}
