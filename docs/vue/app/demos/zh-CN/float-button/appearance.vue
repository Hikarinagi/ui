<script setup lang="ts">
  import { ref } from 'vue'
  import { HelpCircle, Pencil, Plus } from '@lucide/vue'
  import { FloatButton, Flex, Stack, Text } from '@hina-ui/vue'

  const result = ref('悬停或键盘聚焦可以查看操作名称')
</script>

<template>
  <Stack align="center" gap="lg">
    <Flex wrap justify="center" gap="lg">
      <FloatButton position="static" label="新建项目" @click="result = '已选择：新建项目'">
        <Plus />
      </FloatButton>
      <FloatButton
        position="static"
        label="编辑项目"
        variant="soft"
        shape="square"
        @click="result = '已选择：编辑项目'"
      >
        <Pencil />
      </FloatButton>
      <FloatButton
        position="static"
        label="帮助中心"
        variant="outline"
        tone="neutral"
        @click="result = '已选择：帮助中心'"
      >
        <HelpCircle />
      </FloatButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
