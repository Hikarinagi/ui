<script setup lang="ts">
  import { FileText, ListChecks, Send } from '@lucide/vue'
  import { Stepper, Tag, Inline, Text, type StepperItem } from '@hina-ui/vue'

  interface Item extends StepperItem {
    note: string
  }
  const icons = [FileText, ListChecks, Send]
  const items: Item[] = [
    { title: '步骤 A', note: '必填' },
    { title: '步骤 B', note: '可选' },
    { title: '步骤 C', note: '确认' },
  ]
</script>

<template>
  <Stepper :items="items" :linear="false">
    <template #indicator="{ index }"><component :is="icons[index]" /></template>
    <template #title="{ item, active }">
      <Inline as="span" justify="center" gap="sm">
        <Text as="span" weight="medium">{{ item.title }}</Text>
        <Tag :tone="active ? 'accent' : 'neutral'">{{ item.note }}</Tag>
      </Inline>
    </template>
  </Stepper>
</template>
