<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter class="border-line h-48 w-full max-w-xl rounded-lg border">
    <SplitterPanel>
      <Center class="h-full">
        <Text size="sm" tone="muted">Left panel</Text>
      </Center>
    </SplitterPanel>
    <SplitterHandle />
    <SplitterPanel>
      <Center class="h-full">
        <Text size="sm" tone="muted">Right panel</Text>
      </Center>
    </SplitterPanel>
  </Splitter>
</template>
