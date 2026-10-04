import { Avatar, HoverCard, Inline, Link, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text>
      This comment is from
      <HoverCard
        content={
          <Stack gap="sm" className="w-64">
            <Inline gap="sm" align="center">
              <Avatar src="/avatars/selfie.webp" name="Hoshimi Shion" size="md" />
              <Stack gap="none">
                <Text weight="medium">Hoshimi Shion</Text>
                <Text tone="muted" size="sm">
                  @shion
                </Text>
              </Stack>
            </Inline>
            <Text size="sm">
              Reads, writes, draws now and then. Catching up on this season&apos;s anime.
            </Text>
            <Inline gap="md">
              <Text size="sm">
                <Text as="span" weight="medium">
                  128
                </Text>
                following
              </Text>
              <Text size="sm">
                <Text as="span" weight="medium">
                  2,048
                </Text>
                followers
              </Text>
            </Inline>
          </Stack>
        }
      >
        <Link href="#">@shion</Link>
      </HoverCard>
      , posted three days ago.
    </Text>
  )
}
