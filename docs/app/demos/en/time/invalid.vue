<script setup lang="ts">
  import { Stack, Text, Time } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-sm">
    <Text>
      Value is null:
      <Time :value="null" />
    </Text>
    <Text>
      Cannot be parsed:
      <Time value="yesterday afternoon" />
    </Text>
  </Stack>
</template>
