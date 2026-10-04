<script setup lang="ts">
  import { Button, Dialog, Inline, Text } from '@hina-ui/vue'

  const widths = [
    { label: '40rem', class: 'max-w-[40rem]' },
    { label: '52rem', class: 'max-w-[52rem]' },
  ]
</script>

<template>
  <Inline>
    <Dialog v-for="width in widths" :key="width.label" :title="width.label" :class="width.class">
      <Button variant="outline" tone="neutral">{{ width.label }}</Button>
      <template #content>
        <Text>通过 class 设置最大宽度，窄屏仍受视口限制。</Text>
      </template>
    </Dialog>
  </Inline>
</template>
