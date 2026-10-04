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
          窄屏时封面在上、文字在下，宽屏时并排。断点用 Tailwind 的类覆盖 direction。
        </Text>
      </Flex>
    </Flex>
  )
}
