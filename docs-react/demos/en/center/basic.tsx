import { Card, Center } from '@hina-ui/react'

export default function Demo() {
  return (
    <Center className="bg-inset h-32 w-full max-w-sm rounded-md">
      <Card className="grid size-16 place-items-center" padded={false}>
        Centred
      </Card>
    </Center>
  )
}
