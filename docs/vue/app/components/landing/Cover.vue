<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Image, Inline, Rating, Stack, Tag, Text } from '@hina-ui/vue'

  const { t } = useI18n()
  const score = ref(4)
</script>

<template>
  <Card :padded="false" class="w-[260px] overflow-hidden">
    <Image
      src="/cover.webp"
      :alt="t('landing.wall.cover.alt')"
      :ratio="1058 / 1500"
      :lazy="false"
      eager
    />
    <Stack gap="xs" align="start" class="p-4">
      <Text weight="medium">{{ t('landing.wall.cover.title') }}</Text>
      <Text tone="muted" size="sm">{{ t('landing.wall.cover.brand') }}</Text>
      <Inline gap="sm" align="center" class="pt-1">
        <Rating v-model="score" size="sm" :aria-label="t('landing.wall.cover.title')" />
        <Tag tone="info">{{ t('landing.wall.cover.tag') }}</Tag>
      </Inline>
    </Stack>
  </Card>
</template>
