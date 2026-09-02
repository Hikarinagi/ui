<script setup lang="ts">
  import { PrevNext, PrevNextLink, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-full max-w-2xl">
    <Stack gap="sm">
      <Text size="sm" tone="faint">只有下一项</Text>
      <PrevNext>
        <PrevNextLink direction="next" href="#">第一章 夏之扉</PrevNextLink>
      </PrevNext>
    </Stack>

    <Stack gap="sm">
      <Text size="sm" tone="faint">只有上一项</Text>
      <PrevNext>
        <PrevNextLink direction="prev" href="#">第十二章 终章</PrevNextLink>
      </PrevNext>
    </Stack>
  </Stack>
</template>
