<script setup lang="ts">
  import { BookOpen } from '@lucide/vue'
  import { Callout, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Callout :icon="false">Without an icon the text fills the whole width of the note.</Callout>
    <Callout tone="info">
      <template #icon>
        <BookOpen class="text-info-text mt-0.5 size-5 shrink-0" />
      </template>
      Swap in an icon that suits the content.
    </Callout>
  </Stack>
</template>
