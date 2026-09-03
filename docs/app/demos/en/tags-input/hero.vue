<script setup lang="ts">
  import { ref } from 'vue'
  import { TagsInput } from '@hina-ui/vue'

  const tags = ref(['Galgame', 'Light novel'])
</script>

<template>
  <TagsInput v-model="tags" placeholder="Add a tag" aria-label="Tags" class="max-w-sm" />
</template>
