<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Kbd, Text, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)

  const steps: TourStep[] = [
    { target: '#tour-custom-command', title: '命令面板', description: '随时打开命令面板。' },
    { target: '#tour-custom-theme', title: '主题', description: '在浅色与深色之间切换。' },
  ]
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-custom-command" variant="outline" tone="neutral">命令</Button>
    <Button id="tour-custom-theme" variant="outline" tone="neutral">主题</Button>
    <Button variant="ghost" tone="neutral" @click="open = true">开始引导</Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" locked>
    <template #content="{ step, current }">
      <Text tone="muted" size="sm">{{ step.description }}</Text>
      <Text v-if="current === 1" size="sm" class="mt-2">
        按
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        打开。
      </Text>
    </template>
    <template #footer="{ current, total, next, prev }">
      <Inline gap="sm" align="center" justify="between">
        <Inline gap="xs" aria-hidden="true">
          <span
            v-for="index in total"
            :key="index"
            class="size-1.5 rounded-full"
            :class="index === current ? 'bg-accent' : 'bg-line'"
          />
        </Inline>
        <Inline gap="sm">
          <Button v-if="current > 1" size="sm" variant="ghost" tone="neutral" @click="prev">
            返回
          </Button>
          <Button size="sm" @click="next">{{ current === total ? '知道了' : '继续' }}</Button>
        </Inline>
      </Inline>
    </template>
  </Tour>
</template>
