<script setup lang="ts">
  import { Avatar, Inline, Panel, Stack, Text } from '@hina-ui/vue'

  const members = [
    { name: 'Hoshimi Shion', src: '/avatars/selfie.webp', role: 'Admin' },
    { name: 'Peek', src: '/avatars/peek.webp', role: 'Member' },
    { name: 'Glass', src: '/avatars/glass.webp', role: 'Member' },
  ]
</script>

<template>
  <Panel title="Members" :count="members.length" :padded="false" class="w-96">
    <Stack gap="none" align="stretch" class="divide-line divide-y">
      <Inline
        v-for="member in members"
        :key="member.name"
        gap="sm"
        align="center"
        class="px-(--hn-panel-p) py-2.5"
      >
        <Avatar :src="member.src" :name="member.name" size="sm" />
        <Text size="sm">{{ member.name }}</Text>
        <Text size="sm" tone="muted">{{ member.role }}</Text>
      </Inline>
    </Stack>
  </Panel>
</template>
