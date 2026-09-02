<script setup lang="ts">
  import { List, ListItem } from '@hikarinagi/ui'
</script>

<template>
  <List class="max-w-md">
    <ListItem>
      Typography
      <List>
        <ListItem>Text</ListItem>
        <ListItem>Heading</ListItem>
      </List>
    </ListItem>
    <ListItem>
      Atoms
      <List>
        <ListItem>Button</ListItem>
        <ListItem>Tag</ListItem>
      </List>
    </ListItem>
  </List>
</template>
