<script setup lang="ts">
  import { Stepper, Button, Card, Inline, Stack, Text } from '@hina-ui/vue'

  const items = [
    { title: '步骤 A', description: '第一项的说明' },
    { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
    { title: '步骤 C', description: '最后一项的说明' },
  ]
</script>

<template>
  <Stepper :items="items">
    <template #default="{ item, step, next, prev, canNext, canPrev }">
      <Card>
        <Stack gap="lg">
          <Text weight="medium">{{ item?.title }}</Text>
          <Text tone="muted">这里是第 {{ step }} 步的内容。</Text>
          <Inline justify="between">
            <Button variant="outline" tone="neutral" :disabled="!canPrev" @click="prev">
              上一步
            </Button>
            <Button :disabled="!canNext" @click="next">下一步</Button>
          </Inline>
        </Stack>
      </Card>
    </template>
  </Stepper>
</template>
