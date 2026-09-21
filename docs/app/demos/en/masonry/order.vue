<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, FormField, Masonry, Stack, Switch, Text } from '@hina-ui/vue'
  const sequential = ref(false)
  const heights = [120, 200, 88, 148, 100, 168, 88, 112, 144].map((height, id) => ({ id, height }))
</script>

<template>
  <Stack class="w-full max-w-lg">
    <FormField label="Place in sequential columns" orientation="horizontal">
      <Switch v-model="sequential" />
    </FormField>
    <Masonry
      :items="heights"
      :get-key="item => item.id"
      :columns="3"
      :sequential="sequential"
      label="Placement comparison"
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
    <Text size="sm" tone="muted">
      By default, each card fills the shortest column. Sequential placement cycles through columns
      1, 2 and 3.
    </Text>
  </Stack>
</template>
