<script setup lang="ts">
  import { Affix, Card, Heading, ScrollArea, Stack, Text } from '@hina-ui/vue'
  import { affixChecklist } from '../../affix'
  const items = affixChecklist('zh-CN')
  const groups = [
    { title: '设计与内容', items: items.slice(0, 3) },
    { title: '运行与适配', items: items.slice(3) },
  ]
</script>

<template>
  <Stack class="w-full max-w-xl" gap="sm">
    <Text size="sm" tone="muted">
      每组标题只留在自己的区域内。滚到下一组时，上一组标题会一起离开。
    </Text>
    <Card :padded="false">
      <ScrollArea class="h-72" :shadow="false" focusable label="分组检查说明">
        <Stack gap="none">
          <Stack v-for="group in groups" :key="group.title" gap="none">
            <Affix>
              <Heading :level="3" size="sm" class="bg-surface border-line border-b px-4 py-3">
                {{ group.title }}
              </Heading>
            </Affix>
            <Stack v-for="item in group.items" :key="item.title" class="p-4" gap="sm">
              <Text size="sm" weight="medium">{{ item.title }}</Text>
              <Text size="sm" tone="muted">{{ item.description }}</Text>
            </Stack>
          </Stack>
        </Stack>
      </ScrollArea>
    </Card>
  </Stack>
</template>
