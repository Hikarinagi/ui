<script setup lang="ts">
  import { Center, Splitter, SplitterHandle, SplitterPanel, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Splitter class="border-line h-48 w-full max-w-xl rounded-lg border">
    <SplitterPanel :default-size="25" :min-size="15" :max-size="40">
      <Center class="h-full px-3">
        <Stack gap="none" align="center">
          <Text size="sm" tone="muted">Sidebar</Text>
          <Text size="sm" tone="faint">15% – 40%</Text>
        </Stack>
      </Center>
    </SplitterPanel>
    <SplitterHandle />
    <SplitterPanel :default-size="75">
      <Center class="h-full">
        <Text size="sm" tone="muted">Main area</Text>
      </Center>
    </SplitterPanel>
  </Splitter>
</template>
