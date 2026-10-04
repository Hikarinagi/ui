<script setup lang="ts">
  import { Avatar, AvatarGroup, Stack, Text } from '@hina-ui/vue'

  const members = [
    { src: '/avatars/paper.webp', name: 'Shion Hoshimi' },
    { src: '/avatars/peek.webp', name: 'Peek' },
    { src: '/avatars/glass.webp', name: 'Glass' },
    { src: '/avatars/huh.webp', name: 'Huh' },
    { src: '/avatars/run.webp', name: 'Run' },
    { src: '/avatars/sleep.webp', name: 'Sleep' },
  ]
</script>

<template>
  <Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">All of them</Text>
      <AvatarGroup>
        <Avatar v-for="m in members.slice(0, 4)" :key="m.name" :src="m.src" :alt="m.name" />
      </AvatarGroup>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">Three at most, the rest folded into a count</Text>
      <AvatarGroup :max="3" size="lg">
        <Avatar v-for="m in members" :key="m.name" :src="m.src" :alt="m.name" />
      </AvatarGroup>
    </Stack>
  </Stack>
</template>
