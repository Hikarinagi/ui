<script setup lang="ts">
  import { Kbd, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      Press
      <Kbd>Enter</Kbd>
      to submit and
      <Kbd>Esc</Kbd>
      to cancel.
    </Text>
    <Text size="sm">
      An
      <Kbd>Enter</Kbd>
      in small text shrinks along with it.
    </Text>
  </Stack>
</template>
