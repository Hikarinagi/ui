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
            <Tag>科幻</Tag>
            <Tag>连载中</Tag>
          </Flex>
        </Flex>
        <Flex gap="sm">
          <Button variant="soft" tone="neutral">
            加入书架
          </Button>
          <Button>开始阅读</Button>
        </Flex>
      </Flex>
    </Card>
  )
}
