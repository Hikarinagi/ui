<script setup lang="ts">
  import { ref } from 'vue'
  import { TagsInput } from '@hina-ui/vue'

  const tags = ref(['Key', 'Type-Moon', 'Nitroplus'])
</script>

<template>
  <TagsInput
    v-model="tags"
    clearable
    placeholder="Add a studio"
    aria-label="Studios"
    class="max-w-sm"
  />
</template>
