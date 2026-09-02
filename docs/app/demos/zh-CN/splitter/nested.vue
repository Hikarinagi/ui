<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter class="border-line h-64 w-full max-w-xl rounded-lg border">
    <SplitterPanel :default-size="30" :min-size="20">
      <Center class="h-full">
        <Text size="sm" tone="muted">目录</Text>
      </Center>
    </SplitterPanel>
    <SplitterHandle />
    <SplitterPanel :default-size="70">
      <Splitter direction="vertical" class="h-full">
        <SplitterPanel :default-size="65">
          <Center class="h-full">
            <Text size="sm" tone="muted">编辑</Text>
          </Center>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel :default-size="35">
          <Center class="h-full">
            <Text size="sm" tone="muted">预览</Text>
          </Center>
        </SplitterPanel>
      </Splitter>
    </SplitterPanel>
  </Splitter>
</template>
