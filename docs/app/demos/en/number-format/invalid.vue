<script setup lang="ts">
  import { NumberFormat, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      Value is null:
      <NumberFormat :value="null" />
    </Text>
    <Text>
      Value is NaN:
      <NumberFormat :value="Number.NaN" />
    </Text>
  </Stack>
</template>
