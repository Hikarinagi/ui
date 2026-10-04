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
            Your shelf is empty
          </Heading>
          <Text tone="muted" size="sm">
            Anything you save will show up here.
          </Text>
          <Button size="sm" variant="soft" tone="neutral">
            Browse works
          </Button>
        </Stack>
      </Center>
    </Card>
  )
}
