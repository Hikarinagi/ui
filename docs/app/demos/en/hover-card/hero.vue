<script setup lang="ts">
  import { Avatar, HoverCard, Inline, Link, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Text>
    This comment is from
    <HoverCard>
      <Link href="#">@shion</Link>
      <template #content>
        <Stack gap="sm" class="w-64">
          <Inline gap="sm" align="center">
            <Avatar src="/avatars/selfie.webp" name="Hoshimi Shion" size="md" />
            <Stack gap="none">
              <Text weight="medium">Hoshimi Shion</Text>
              <Text tone="muted" size="sm">@shion</Text>
            </Stack>
          </Inline>
          <Text size="sm">
            Reads, writes, draws now and then. Catching up on this season's anime.
          </Text>
          <Inline gap="md">
            <Text size="sm">
              <Text as="span" weight="medium">128</Text>
              following
            </Text>
            <Text size="sm">
              <Text as="span" weight="medium">2,048</Text>
              followers
            </Text>
          </Inline>
        </Stack>
      </template>
    </HoverCard>
    , posted three days ago.
  </Text>
</template>
