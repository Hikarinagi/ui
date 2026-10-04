<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, FormField, Masonry, Select, Stack, Switch, Text, Flex } from '@hina-ui/vue'
  import { masonryNotes } from '../../masonry'
  const narrow = ref(false)
  const rtl = ref(false)
  const columns = ref('auto')
  const items = masonryNotes('en')
  const options = [
    { label: 'Automatic columns', value: 'auto' },
    { label: 'Two columns', value: '2' },
    { label: 'Three columns', value: '3' },
  ]
</script>

<template>
  <Stack class="w-full max-w-2xl">
    <Flex wrap gap="md" align="center">
      <Select v-model="columns" :options="options" aria-label="Columns" class="w-44" />
      <FormField label="Narrow container" orientation="horizontal">
        <Switch v-model="narrow" />
      </FormField>
      <FormField label="RTL" orientation="horizontal"><Switch v-model="rtl" /></FormField>
    </Flex>
    <Masonry
      :items="items"
      :get-key="item => item.id"
      :columns="columns === 'auto' ? undefined : Number(columns)"
      :min-column-width="180"
      :dir="rtl ? 'rtl' : 'ltr'"
      :class="narrow ? 'mx-auto max-w-xs' : ''"
      label="Design notes"
    >
      <template #default="{ item, index }">
        <Card>
          <Stack gap="sm">
            <Text tone="accent" size="sm" weight="medium">
              {{ String(index + 1).padStart(2, '0') }}
            </Text>
            <Text size="sm" weight="medium">{{ item.title }}</Text>
            <Text size="sm" tone="muted">{{ item.body }}</Text>
          </Stack>
        </Card>
      </template>
    </Masonry>
  </Stack>
</template>
