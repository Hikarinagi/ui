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
    placeholder="以空格分隔，可以整段粘贴"
    aria-label="别名"
    class="max-w-sm"
  />
</template>
