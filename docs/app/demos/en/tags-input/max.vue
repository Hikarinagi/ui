<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, TagsInput, Text } from '@hina-ui/vue'

  const tags = ref(['Slice of life', 'Romance'])
  const rejected = ref('')
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput
      v-model="tags"
      :max="3"
      placeholder="Up to three"
      aria-label="Genres"
      @invalid="rejected = $event"
    />
    <Text tone="muted" size="sm">
      {{ rejected ? `"${rejected}" was not added` : 'Up to three, no duplicates' }}
    </Text>
  </Stack>
</template>
