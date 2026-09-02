<script setup lang="ts">
  import { List, ListItem, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-md">
    <List ordered :start="5">
      <ListItem>Starts at five</ListItem>
      <ListItem>Then six</ListItem>
    </List>
    <List ordered reversed>
      <ListItem>First item, counting down</ListItem>
      <ListItem>Second item, counting down</ListItem>
    </List>
  </Stack>
</template>
