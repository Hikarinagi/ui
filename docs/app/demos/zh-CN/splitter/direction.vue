<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter direction="vertical" class="border-line h-64 w-full max-w-xl rounded-lg border">
    <SplitterPanel :default-size="40">
      <Center class="h-full">
        <Text size="sm" tone="muted">上方面板</Text>
      </Center>
    </SplitterPanel>
    <SplitterHandle />
    <SplitterPanel :default-size="60">
      <Center class="h-full">
        <Text size="sm" tone="muted">下方面板</Text>
      </Center>
    </SplitterPanel>
  </Splitter>
</template>
