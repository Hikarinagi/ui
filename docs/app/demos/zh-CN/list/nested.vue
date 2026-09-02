<script setup lang="ts">
  import { List, ListItem } from '@hina-ui/vue'
</script>

<template>
  <List class="max-w-md">
    <ListItem>
      排版
      <List>
        <ListItem>Text</ListItem>
        <ListItem>Heading</ListItem>
      </List>
    </ListItem>
    <ListItem>
      原子
      <List>
        <ListItem>Button</ListItem>
        <ListItem>Tag</ListItem>
      </List>
    </ListItem>
  </List>
</template>
