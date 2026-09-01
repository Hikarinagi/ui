<script setup lang="ts">
  import { Container, Heading, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <div class="bg-inset w-full rounded-md py-8">
    <Container size="sm">
      <Stack gap="xs">
        <Heading :level="3" size="lg">观测者的黎明</Heading>
        <Text tone="muted">
          容器把内容限制在可读的宽度内，并在页面里居中。两侧的内边距随屏幕宽度变化，窄屏 16
          像素，宽屏 24 像素。
        </Text>
      </Stack>
    </Container>
  </div>
</template>
