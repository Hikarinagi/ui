<script setup lang="ts">
  import { Avatar, HoverCard, Inline, Link, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Text>
    这条评论来自
    <HoverCard>
      <Link href="#">@星见书音</Link>
      <template #content>
        <Stack gap="sm" class="w-64">
          <Inline gap="sm" align="center">
            <Avatar src="/avatars/selfie.webp" name="星见书音" size="md" />
            <Stack gap="none">
              <Text weight="medium">星见书音</Text>
              <Text tone="muted" size="sm">@shion</Text>
            </Stack>
          </Inline>
          <Text size="sm">读书、写字、偶尔画画。正在补完今年的新番。</Text>
          <Inline gap="md">
            <Text size="sm">
              <Text as="span" weight="medium">128</Text>
              关注
            </Text>
            <Text size="sm">
              <Text as="span" weight="medium">2,048</Text>
              粉丝
            </Text>
          </Inline>
        </Stack>
      </template>
    </HoverCard>
    ，发表于三天前。
  </Text>
</template>
