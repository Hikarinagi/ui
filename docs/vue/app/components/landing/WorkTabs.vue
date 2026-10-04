<script setup lang="ts">
  import { Stack, Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Tabs default-value="intro" class="w-[280px]">
    <TabsList :label="t('landing.wall.workTabs.label')">
      <TabsTrigger value="intro">{{ t('landing.wall.workTabs.intro') }}</TabsTrigger>
      <TabsTrigger value="cast">{{ t('landing.wall.workTabs.cast') }}</TabsTrigger>
      <TabsTrigger value="staff">{{ t('landing.wall.workTabs.staff') }}</TabsTrigger>
    </TabsList>
    <TabsContent v-for="key in ['intro', 'cast', 'staff']" :key="key" :value="key">
      <Stack gap="xs" class="pt-4">
        <Text tone="muted" size="sm">{{ t(`landing.wall.workTabs.${key}Body`) }}</Text>
      </Stack>
    </TabsContent>
  </Tabs>
</template>
