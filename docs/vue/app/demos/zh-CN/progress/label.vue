<script setup lang="ts">
  import { Progress, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-80">
    <Progress :value="25" label="正在同步收藏" />
    <Progress :value="25" label="正在同步收藏" show-value />
    <Progress :value="25" show-value />
  </Stack>
</template>
