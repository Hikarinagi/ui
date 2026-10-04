<script setup lang="ts">
  import { Progress, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-80">
    <Progress :value="60" size="sm" />
    <Progress :value="60" />
    <Progress :value="60" size="lg" />
  </Stack>
</template>
