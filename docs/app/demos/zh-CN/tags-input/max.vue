<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, TagsInput, Text } from '@hina-ui/vue'

  const tags = ref(['日常', '恋爱'])
  const rejected = ref('')
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput
      v-model="tags"
      :max="3"
      placeholder="最多三个"
      aria-label="题材"
      @invalid="rejected = $event"
    />
    <Text tone="muted" size="sm">
      {{ rejected ? `「${rejected}」未加入` : '最多三个，不允许重复' }}
    </Text>
  </Stack>
</template>
