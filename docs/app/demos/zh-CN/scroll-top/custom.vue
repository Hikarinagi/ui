<script setup lang="ts">
  import { ref } from 'vue'
  import { ChevronsUp } from '@lucide/vue'
  import {
    Button,
    Card,
    FormField,
    Heading,
    ScrollArea,
    ScrollTop,
    Stack,
    Switch,
    Text,
  } from '@hina-ui/vue'

  const area = ref<InstanceType<typeof ScrollArea>>()
  const heading = ref<InstanceType<typeof Heading>>()
  const instant = ref(false)
  function goDown() {
    area.value?.viewport?.scrollTo({ top: 450, behavior: 'instant' })
  }
</script>

<template>
  <Stack class="w-full max-w-md" gap="sm">
    <FormField label="立即回顶" orientation="horizontal"><Switch v-model="instant" /></FormField>
    <Button variant="outline" tone="neutral" class="self-start" @click="goDown">滚动到中段</Button>
    <Card :padded="false" class="relative overflow-hidden">
      <ScrollArea ref="area" class="h-64" :shadow="false" focusable label="发布检查项">
        <Stack class="p-5 pb-24" gap="lg">
          <Heading
            ref="heading"
            :level="3"
            size="base"
            tabindex="-1"
            class="hn-focus-ring rounded-sm"
          >
            发布检查项
          </Heading>
          <Text
            v-for="item in [
              '验证核心流程',
              '检查空状态',
              '检查加载和重试',
              '检查键盘操作',
              '检查表单错误',
              '检查移动端排版',
              '检查深色模式',
              '检查 RTL',
              '检查服务端渲染',
              '核对文档示例',
              '补齐变更记录',
              '确认发布版本',
            ]"
            :key="item"
            size="sm"
            class="border-line border-b pb-3"
          >
            {{ item }}
          </Text>
        </Stack>
      </ScrollArea>
      <ScrollTop
        :target="() => area?.viewport"
        :focus-target="() => heading?.$el"
        :threshold="80"
        :behavior="instant ? 'instant' : 'smooth'"
        position="absolute"
        :offset="16"
        extended
        size="sm"
        shape="square"
        variant="soft"
        tone="accent"
        label="返回检查项开头"
      >
        <ChevronsUp />
      </ScrollTop>
    </Card>
    <Text size="sm" tone="muted">回顶后将焦点移到标题，可以从这里继续键盘浏览。</Text>
  </Stack>
</template>
