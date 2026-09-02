<script setup lang="ts">
  import { Anchor, Heading, Inline, ScrollArea, Section, Text } from '@hina-ui/vue'

  const items = [
    { id: 'nest-intro', label: '简介' },
    {
      id: 'nest-route',
      label: '路线',
      children: [
        { id: 'nest-route-a', label: '共通线' },
        { id: 'nest-route-b', label: '个人线' },
      ],
    },
    { id: 'nest-staff', label: '制作人员' },
  ]

  const flat = items.flatMap(item => [item, ...(item.children ?? [])])
</script>

<template>
  <Inline gap="lg" align="start" class="w-full max-w-2xl">
    <ScrollArea class="border-line h-56 flex-1 rounded-lg border">
      <Section v-for="item in flat" :id="item.id" :key="item.id" class="min-h-32 p-4">
        <Heading :level="3" size="sm">{{ item.label }}</Heading>
        <Text size="sm" tone="muted">这一节的正文。</Text>
      </Section>
    </ScrollArea>
    <Anchor :items="items" class="w-32 shrink-0" />
  </Inline>
</template>
