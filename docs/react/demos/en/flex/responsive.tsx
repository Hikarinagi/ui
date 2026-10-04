import { Card, Flex, Heading, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Flex direction="col" gap="md" className="w-full max-w-lg sm:flex-row sm:items-center">
      <Card className="bg-inset h-24 shrink-0 sm:w-32" padded={false} />
      <Flex direction="col" gap="xs">
        <Heading level={3} size="md">
          ATRI
        </Heading>
        <Text tone="muted" size="sm">
          The cover sits above the text on a narrow screen and beside it on a wide one. Breakpoints
          override direction through Tailwind classes.
        </Text>
      </Flex>
    </Flex>
  )
}
