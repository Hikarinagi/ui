import { HoverCard, Inline, Link, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg">
      <HoverCard
        openDelay={0}
        closeDelay={0}
        content={<Text size="sm">No delay; it appears as soon as the pointer arrives.</Text>}
      >
        <Link href="#">At once</Link>
      </HoverCard>
      <HoverCard
        openDelay={800}
        closeDelay={400}
        content={
          <Text size="sm">
            Appears after 800 milliseconds and closes 400 milliseconds after leaving.
          </Text>
        }
      >
        <Link href="#">Rest a little longer</Link>
      </HoverCard>
    </Inline>
  )
}
