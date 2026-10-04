import { Button, Card, Flex, Heading, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-lg">
      <Flex justify="between" align="center" wrap className="gap-3">
        <Flex direction="col" gap="xs">
          <Heading level={3} size="md">
            ATRI
          </Heading>
          <Flex gap="xs">
            <Tag>Sci-fi</Tag>
            <Tag>Ongoing</Tag>
          </Flex>
        </Flex>
        <Flex gap="sm">
          <Button variant="soft" tone="neutral">
            Add to shelf
          </Button>
          <Button>Read</Button>
        </Flex>
      </Flex>
    </Card>
  )
}
