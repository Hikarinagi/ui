<script setup lang="ts">
  import { Bold, Italic, Link2, Strikethrough } from '@lucide/vue'
  import { ButtonGroup, IconButton } from '@hina-ui/vue'
</script>

<template>
  <ButtonGroup label="Text formatting">
    <IconButton label="Bold" variant="outline">
      <Bold />
    </IconButton>
    <IconButton label="Italic" variant="outline">
      <Italic />
    </IconButton>
    <IconButton label="Strikethrough" variant="outline">
      <Strikethrough />
    </IconButton>
    <IconButton label="Insert link" variant="outline">
      <Link2 />
    </IconButton>
  </ButtonGroup>
</template>
