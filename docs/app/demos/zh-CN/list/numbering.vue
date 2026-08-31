<script setup lang="ts">
  import { List, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="max-w-md">
    <List ordered :start="5">
      <li>从第五项开始</li>
      <li>接着第六项</li>
    </List>
    <List ordered reversed>
      <li>倒序的第一项</li>
      <li>倒序的第二项</li>
    </List>
  </Stack>
</template>
