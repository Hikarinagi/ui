<script setup lang="ts">
  import { Avatar, AvatarGroup, Stack, Text } from '@hikarinagi/ui'

  const members = [
    { src: '/avatars/paper.webp', name: '星见书音' },
    { src: '/avatars/peek.webp', name: '偷瞄' },
    { src: '/avatars/glass.webp', name: '玻璃' },
    { src: '/avatars/huh.webp', name: '疑惑' },
    { src: '/avatars/run.webp', name: '快跑' },
    { src: '/avatars/sleep.webp', name: '睡觉' },
  ]
</script>

<template>
  <Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">全部显示</Text>
      <AvatarGroup>
        <Avatar v-for="m in members.slice(0, 4)" :key="m.name" :src="m.src" :alt="m.name" />
      </AvatarGroup>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">最多显示三个，其余折成计数</Text>
      <AvatarGroup :max="3" size="lg">
        <Avatar v-for="m in members" :key="m.name" :src="m.src" :alt="m.name" />
      </AvatarGroup>
    </Stack>
  </Stack>
</template>
