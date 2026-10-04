import { HoverCard, Link, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <HoverCard
      content={
        <Stack gap="xs" className="w-64">
          <Text weight="medium">Reka UI</Text>
          <Text tone="muted" size="sm">
            An unstyled, accessible set of Vue primitives that most interactive components in this
            library are built on.
          </Text>
        </Stack>
      }
    >
      <Link href="#">Reka UI</Link>
    </HoverCard>
  )
}
