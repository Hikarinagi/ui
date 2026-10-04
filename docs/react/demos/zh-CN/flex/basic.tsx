import { Card, Flex } from '@hina-ui/react'

export default function Demo() {
  return (
    <Flex gap="sm">
      <Card className="bg-inset size-10" padded={false} />
      <Card className="bg-inset size-10" padded={false} />
      <Card className="bg-inset size-10" padded={false} />
    </Flex>
  )
}
