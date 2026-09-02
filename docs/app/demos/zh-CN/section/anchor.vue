<script setup lang="ts">
  import { Anchor, Card, Inline, ScrollArea, Section, Text } from '@hina-ui/vue'

  const items = [
    { id: 'sec-intro', label: '简介' },
    { id: 'sec-cast', label: '角色' },
    { id: 'sec-staff', label: '制作人员' },
  ]
</script>

<template>
  <Inline gap="lg" align="start" class="w-full">
    <Card :padded="false" class="min-w-0 flex-1 overflow-hidden">
      <ScrollArea class="h-56">
        <Section v-for="item in items" :id="item.id" :key="item.id" :title="item.label" class="p-4">
          <Text size="sm" tone="muted">这一节的正文。</Text>
          <Text size="sm" tone="muted">滚动或点击右侧条目都会更新当前位置。</Text>
        </Section>
      </ScrollArea>
    </Card>
    <Anchor :items="items" class="w-28 shrink-0" />
  </Inline>
</template>
