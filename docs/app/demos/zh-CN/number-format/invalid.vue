<script setup lang="ts">
  import { NumberFormat, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      数值为 null：
      <NumberFormat :value="null" />
    </Text>
    <Text>
      数值为 NaN：
      <NumberFormat :value="Number.NaN" />
    </Text>
  </Stack>
</template>
