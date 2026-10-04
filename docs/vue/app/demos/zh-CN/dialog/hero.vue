<script setup lang="ts">
  import { Avatar, Button, Dialog, Inline, Input, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Dialog title="编辑资料" description="改动会立刻同步到你的主页。">
    <Button variant="outline" tone="neutral">编辑资料</Button>
    <template #content>
      <Stack gap="sm">
        <Inline gap="sm">
          <Avatar size="lg" src="/avatars/glass.webp" alt="星见书音" />
          <Button size="sm" variant="soft" tone="neutral">更换头像</Button>
        </Inline>
        <Stack gap="xs">
          <Text size="sm">昵称</Text>
          <Input model-value="星见书音" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">简介</Text>
          <Input model-value="行商人与自称丰收之神的少女同行的旅途。" />
        </Stack>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">取消</Button>
      <Button @click="close">保存</Button>
    </template>
  </Dialog>
</template>
