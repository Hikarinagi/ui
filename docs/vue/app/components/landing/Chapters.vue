<script setup lang="ts">
  import { Card, ScrollArea, Stack, Text } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Card :padded="false" class="w-[220px]">
    <ScrollArea class="h-56">
      <Stack gap="none" class="p-2">
        <Text v-for="n in 24" :key="n" size="sm" class="px-3 py-2">
          {{ t('landing.wall.chapters.item', { n }) }}
        </Text>
      </Stack>
    </ScrollArea>
  </Card>
</template>
