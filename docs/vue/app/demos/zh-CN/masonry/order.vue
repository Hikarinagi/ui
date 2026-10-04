<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, FormField, Masonry, Stack, Switch, Text } from '@hina-ui/vue'
  const sequential = ref(false)
  const heights = [120, 200, 88, 148, 100, 168, 88, 112, 144].map((height, id) => ({ id, height }))
</script>

<template>
  <Stack class="w-full max-w-lg">
    <FormField label="按列轮流排列" orientation="horizontal">
      <Switch v-model="sequential" />
    </FormField>
    <Masonry
      :items="heights"
      :get-key="item => item.id"
      :columns="3"
      :sequential="sequential"
      label="排列顺序对比"
    >
      <template #default="{ item, index }">
        <Card
          class="bg-accent-soft flex items-center justify-center"
          :style="{ height: item.height + 'px' }"
        >
          <Text tone="accent" weight="medium">{{ index + 1 }}</Text>
        </Card>
      </template>
    </Masonry>
    <Text size="sm" tone="muted">关闭时优先填入最短的一列；开启后依次放入第 1、2、3 列。</Text>
  </Stack>
</template>
