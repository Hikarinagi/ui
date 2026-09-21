<script setup lang="ts">
  import { ref } from 'vue'
  import { DropdownMenuItem, Flex, SplitButton, Stack, Text } from '@hina-ui/vue'

  const variants = ['solid', 'soft', 'outline', 'ghost'] as const
  const result = ref('每种外观都保留独立的主操作和菜单')
</script>

<template>
  <Stack align="center" gap="lg">
    <Flex wrap justify="center" gap="lg">
      <SplitButton
        v-for="variant in variants"
        :key="variant"
        :variant="variant"
        :menu-label="`${variant} 的更多操作`"
        @click="result = `${variant}：已保存`"
      >
        {{ variant }}
        <template #content>
          <DropdownMenuItem @select="result = `${variant}：另存副本`">另存副本</DropdownMenuItem>
        </template>
      </SplitButton>
    </Flex>
    <Flex wrap justify="center" gap="lg">
      <SplitButton tone="neutral" menu-label="下载方式" @click="result = '已执行：下载'">
        下载
        <template #content>
          <DropdownMenuItem @select="result = '已执行：复制链接'">复制链接</DropdownMenuItem>
        </template>
      </SplitButton>
      <SplitButton
        tone="danger"
        variant="soft"
        menu-label="归档方式"
        @click="result = '已执行：归档'"
      >
        归档
        <template #content>
          <DropdownMenuItem @select="result = '已执行：移至回收站'">移至回收站</DropdownMenuItem>
        </template>
      </SplitButton>
    </Flex>
    <Text role="status" size="sm" tone="muted">{{ result }}</Text>
  </Stack>
</template>
