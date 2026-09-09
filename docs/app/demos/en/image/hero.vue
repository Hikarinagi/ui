<script setup lang="ts">
  import { Card, Image, Stack, Tag, Text } from '@hina-ui/vue'
</script>

<template>
  <Card class="w-full max-w-xs" :padded="false">
    <Image
      src="/sample.webp"
      alt="A slope on a summer afternoon"
      :ratio="4 / 3"
      :lazy="false"
      eager
      class="rounded-t-lg"
    />
    <Stack gap="xs" align="start" class="p-4">
      <Text class="font-medium">ATRI</Text>
      <Tag>Sci-fi</Tag>
    </Stack>
  </Card>
</template>
