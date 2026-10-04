import { Button, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      <Button className="rounded-none px-8">直角</Button>
      <Button variant="outline" tone="neutral" className="border-dashed">
        虚线边框
      </Button>
      <Button className="bg-purple-600 text-white hover:bg-purple-700">紫色</Button>
    </Inline>
  )
}
