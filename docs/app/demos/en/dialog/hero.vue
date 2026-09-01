<script setup lang="ts">
  import { Avatar, Button, Dialog, Inline, Input, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Dialog title="Edit profile" description="Changes sync to your homepage right away.">
    <Button variant="outline" tone="neutral">Edit profile</Button>
    <template #content>
      <Stack gap="sm">
        <Inline gap="sm">
          <Avatar size="lg" src="/avatars/glass.webp" alt="Shion Hoshimi" />
          <Button size="sm" variant="soft" tone="neutral">Change picture</Button>
        </Inline>
        <Stack gap="xs">
          <Text size="sm">Display name</Text>
          <Input model-value="Shion Hoshimi" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">Bio</Text>
          <Input model-value="Restarting an observation programme at an abandoned observatory." />
        </Stack>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">Cancel</Button>
      <Button @click="close">Save</Button>
    </template>
  </Dialog>
</template>
