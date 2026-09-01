<script setup lang="ts">
  import { Card, Image, Stack, Tag, Text } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-xs" :padded="false">
    <Image
      src="/sample.webp"
      alt="夏日午后的坡道"
      :ratio="4 / 3"
      :lazy="false"
      eager
      class="rounded-t-lg"
    />
    <Stack gap="xs" align="start" class="p-4">
      <Text class="font-medium">星之彼方</Text>
      <Tag>科幻</Tag>
    </Stack>
  </Card>
</template>
