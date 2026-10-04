<script setup lang="ts">
  import { Card, Image, LoadingOverlay, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="relative h-56 w-96">
    <Text>书架里的内容正在整理。</Text>
    <LoadingOverlay visible :delay="0">
      <Stack gap="xs" align="center" role="status">
        <Image
          src="/mascot/run.gif"
          alt="星见书音抱着书跑过来"
          :ratio="1"
          fit="contain"
          :skeleton="false"
          eager
          :lazy="false"
          class="size-28"
        />
        <Text size="sm" tone="muted">书音正在整理书架，稍等一下。</Text>
      </Stack>
    </LoadingOverlay>
  </Card>
</template>
