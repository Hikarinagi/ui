<script setup lang="ts">
  import { ref } from 'vue'
  import { Plus } from '@lucide/vue'
  import { FloatButton, Flex, Stack, Text } from '@hina-ui/vue'

  const result = ref('文字按钮使用同一高度，宽度随名称展开')
</script>

<template>
  <Stack align="center" gap="lg">
    <Flex wrap align="center" justify="center" gap="lg">
      <FloatButton
        v-for="size in ['sm', 'md', 'lg'] as const"
        :key="size"
        position="static"
        :size="size"
        :label="`新建项目（${size}）`"
        @click="result = `已选择：${size}`"
      >
        <Plus />
      </FloatButton>
      <FloatButton position="static" extended label="新建项目" @click="result = '已选择：新建项目'">
        <Plus />
      </FloatButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
