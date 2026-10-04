<script setup lang="ts">
  import { SlidersHorizontal } from '@lucide/vue'
  import { Button, Drawer, Input, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Drawer title="筛选" description="设定之后只显示符合条件的作品。">
    <Button variant="outline" tone="neutral">
      <template #icon>
        <SlidersHorizontal />
      </template>
      筛选
    </Button>
    <template #content>
      <Stack gap="sm">
        <Stack gap="xs">
          <Text size="sm">关键词</Text>
          <Input model-value="天文台" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">发行年份</Text>
          <Input model-value="2024" />
        </Stack>
        <Stack gap="xs">
          <Text size="sm">制作方</Text>
          <Input model-value="ANIPLEX.EXE" />
        </Stack>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">重置</Button>
      <Button @click="close">应用</Button>
    </template>
  </Drawer>
</template>
