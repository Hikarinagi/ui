<script setup lang="ts">
  import { List, ListItem } from '@hina-ui/vue'
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
