<script setup lang="ts">
  import { NumberFormat, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      Default:
      <NumberFormat :value="3.14159" />
    </Text>
    <Text>
      precision of 2:
      <NumberFormat :value="3.14159" :precision="2" />
    </Text>
    <Text>
      precision of 0:
      <NumberFormat :value="3.14159" :precision="0" />
    </Text>
  </Stack>
</template>
