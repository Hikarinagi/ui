<script setup lang="ts">
  import { ref } from 'vue'
  import { TagsInput } from '@hina-ui/vue'

  const tags = ref(['Key', 'Type-Moon', 'Nitroplus'])
</script>

<template>
  <TagsInput
    v-model="tags"
    clearable
    placeholder="添加制作公司"
    aria-label="制作公司"
    class="max-w-sm"
  />
</template>
