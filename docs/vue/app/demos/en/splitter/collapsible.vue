<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter class="border-line h-48 w-full max-w-xl rounded-lg border">
    <SplitterPanel collapsible :collapsed-size="0" :default-size="28" :min-size="18">
      <Center class="h-full px-3">
        <Text size="sm" tone="muted">Drag to the left edge to collapse</Text>
      </Center>
    </SplitterPanel>
    <SplitterHandle />
    <SplitterPanel :default-size="72">
      <Center class="h-full">
        <Text size="sm" tone="muted">Main area</Text>
      </Center>
    </SplitterPanel>
  </Splitter>
</template>
