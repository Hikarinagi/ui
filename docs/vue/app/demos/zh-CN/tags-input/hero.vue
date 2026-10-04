<script setup lang="ts">
  import { ref } from 'vue'
  import { TagsInput } from '@hina-ui/vue'

  const tags = ref(['Galgame', '轻小说'])
</script>

<template>
  <TagsInput v-model="tags" placeholder="添加标签" aria-label="作品标签" class="max-w-sm" />
</template>
