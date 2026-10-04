<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter class="border-line h-48 w-full max-w-xl rounded-lg border">
    <SplitterPanel :default-size="35">
      <Center class="h-full">
        <Text size="sm" tone="muted">目录</Text>
      </Center>
    </SplitterPanel>
    <SplitterHandle label="调整目录宽度" />
    <SplitterPanel :default-size="65">
      <Center class="h-full">
        <Text size="sm" tone="muted">正文</Text>
      </Center>
    </SplitterPanel>
  </Splitter>
</template>
