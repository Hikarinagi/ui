<script setup lang="ts">
  import { Card, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/vue'

  const chapters = ['1. The Summer Door', '2. Cicada Rain', '3. Distant Thunder']
</script>

<template>
  <Card :padded="false" class="w-full max-w-2xl overflow-hidden">
    <Splitter class="h-64">
      <SplitterPanel :default-size="32" :min-size="20">
        <Stack gap="xs" class="p-4">
          <Text size="sm" tone="faint">Contents</Text>
          <Text v-for="chapter in chapters" :key="chapter" size="sm">{{ chapter }}</Text>
        </Stack>
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel :default-size="68">
        <Stack gap="sm" class="p-4">
          <Text size="sm" tone="faint">Body</Text>
          <Text size="sm">Drag the divider to resize the two sides.</Text>
        </Stack>
      </SplitterPanel>
    </Splitter>
  </Card>
</template>
