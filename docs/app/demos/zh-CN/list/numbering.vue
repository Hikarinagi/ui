<script setup lang="ts">
  import { List, ListItem, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-md">
    <List ordered :start="5">
      <ListItem>从第五项开始</ListItem>
      <ListItem>接着第六项</ListItem>
    </List>
    <List ordered reversed>
      <ListItem>倒序的第一项</ListItem>
      <ListItem>倒序的第二项</ListItem>
    </List>
  </Stack>
</template>
