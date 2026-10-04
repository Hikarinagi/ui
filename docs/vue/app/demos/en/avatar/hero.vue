<script setup lang="ts">
  import { Avatar, Card, Inline, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-sm">
    <Inline gap="sm">
      <Avatar size="lg" src="/avatars/selfie.webp" name="Shion Hoshimi" />
      <Stack gap="none">
        <Text class="font-medium">Shion Hoshimi</Text>
        <Text tone="muted" size="sm">Translated 128 light novels</Text>
      </Stack>
    </Inline>
  </Card>
</template>
