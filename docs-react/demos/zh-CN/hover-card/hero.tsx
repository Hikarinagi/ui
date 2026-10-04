import { Avatar, HoverCard, Inline, Link, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text>
      这条评论来自
      <HoverCard
        content={
          <Stack gap="sm" className="w-64">
            <Inline gap="sm" align="center">
              <Avatar src="/avatars/selfie.webp" name="星见书音" size="md" />
              <Stack gap="none">
                <Text weight="medium">星见书音</Text>
                <Text tone="muted" size="sm">
                  @shion
                </Text>
              </Stack>
            </Inline>
            <Text size="sm">读书、写字、偶尔画画。正在补完今年的新番。</Text>
            <Inline gap="md">
              <Text size="sm">
                <Text as="span" weight="medium">
                  128
                </Text>
                关注
              </Text>
              <Text size="sm">
                <Text as="span" weight="medium">
                  2,048
                </Text>
                粉丝
              </Text>
            </Inline>
          </Stack>
        }
      >
        <Link href="#">@星见书音</Link>
      </HoverCard>
      ，发表于三天前。
    </Text>
  )
}
