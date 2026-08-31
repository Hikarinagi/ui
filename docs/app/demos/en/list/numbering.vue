<script setup lang="ts">
  import { List, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-md">
    <List ordered :start="5">
      <li>Starts at five</li>
      <li>Then six</li>
    </List>
    <List ordered reversed>
      <li>First item, counting down</li>
      <li>Second item, counting down</li>
    </List>
  </Stack>
</template>
