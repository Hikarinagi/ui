<script setup lang="ts">
  import { ref } from 'vue'
  import { TagsInput } from '@hina-ui/vue'

  const tags = ref<string[]>([])
</script>

<template>
  <TagsInput
    v-model="tags"
    delimiter=" "
    add-on-blur
    placeholder="Space separated, paste a whole list"
    aria-label="Aliases"
    class="max-w-sm"
  />
</template>
