import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button className="rounded-none px-8">Square</Button>
      <Button variant="outline" tone="neutral" className="border-dashed">
        Dashed
      </Button>
      <Button className="bg-purple-600 text-white hover:bg-purple-700">Purple</Button>
    </Inline>
  )
}
