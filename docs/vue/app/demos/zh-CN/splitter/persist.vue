<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter
    auto-save-id="hina-docs-splitter-demo"
    class="border-line h-48 w-full max-w-xl rounded-lg border"
  >
    <SplitterPanel :default-size="35" :min-size="20">
      <Center class="h-full px-3">
        <Stack gap="none" align="center">
          <Text size="sm" tone="muted">调整后刷新页面</Text>
          <Text size="sm" tone="faint">宽度会保留</Text>
        </Stack>
      </Center>
    </SplitterPanel>
    <SplitterHandle />
    <SplitterPanel :default-size="65">
      <Center class="h-full">
        <Text size="sm" tone="muted">主区域</Text>
      </Center>
    </SplitterPanel>
  </Splitter>
</template>
