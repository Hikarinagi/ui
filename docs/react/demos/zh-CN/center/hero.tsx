import { BookOpen } from 'lucide-react'
import { Button, Card, Center, Heading, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-md">
      <Center className="h-56">
        <Stack gap="sm" align="center">
          <Center className="bg-inset text-muted size-12 rounded-full">
            <BookOpen className="size-6" />
          </Center>
          <Heading level={3} size="md">
            书架还是空的
          </Heading>
          <Text tone="muted" size="sm">
            找到喜欢的作品之后，它会出现在这里。
          </Text>
          <Button size="sm" variant="soft" tone="neutral">
            去逛逛
          </Button>
        </Stack>
      </Center>
    </Card>
  )
}
