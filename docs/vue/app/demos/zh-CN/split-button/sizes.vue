<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/vue'

  const sizes = ['sm', 'md', 'lg'] as const
  const result = ref('菜单按钮始终与主操作等高')
</script>

<template>
  <Stack align="center">
    <Flex wrap align="center" justify="center" gap="lg">
      <SplitButton
        v-for="size in sizes"
        :key="size"
        :size="size"
        :menu-label="`${size} 的更多操作`"
        @click="result = `${size}：已保存`"
      >
        保存
        <template #content>
          <DropdownMenuItem @select="result = `${size}：另存副本`">另存副本</DropdownMenuItem>
        </template>
      </SplitButton>
      <SplitButton
        pill
        variant="outline"
        menu-label="圆角按钮的更多操作"
        @click="result = '已执行：保存'"
      >
        圆角按钮
        <template #content>
          <DropdownMenuItem @select="result = '已执行：另存副本'">另存副本</DropdownMenuItem>
        </template>
      </SplitButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
