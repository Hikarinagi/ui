<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, TagsInput, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const tags = ref(['Galgame', '轻小说'])
</script>

<template>
  <Stack gap="sm" class="w-[256px]">
    <Text size="sm" weight="medium">{{ t('landing.wall.tags.label') }}</Text>
    <TagsInput
      v-model="tags"
      :placeholder="t('landing.wall.tags.placeholder')"
      :aria-label="t('landing.wall.tags.label')"
    />
  </Stack>
</template>
