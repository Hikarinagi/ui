<script setup lang="ts">
  import { ref } from 'vue'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import { IconButton, Inline, MonthGrid, Select, Stack, Switch, Text } from '@hina-ui/vue'
  const month = ref('2026-09')
  const fixed = ref(false)
  const outside = ref(false)
  const options = [
    { label: 'September 2026', value: '2026-09' },
    { label: 'October 2026', value: '2026-10' },
    { label: 'November 2026', value: '2026-11' },
  ]
</script>

<template>
  <Stack class="w-full max-w-lg">
    <Inline gap="lg" wrap>
      <Switch v-model="fixed">Fixed six weeks</Switch>
      <Switch v-model="outside">Adjacent months</Switch>
    </Inline>
    <MonthGrid
      v-model:month="month"
      today="2026-09-21"
      min="2026-09-10"
      max="2026-11-20"
      :fixed-weeks="fixed"
      :show-outside-days="outside"
      :week-starts-on="0"
      size="sm"
      label="Available dates"
    >
      <template #header="{ prev, next, canPrev, canNext }">
        <IconButton label="Previous month" size="sm" :disabled="!canPrev" @click="prev">
          <ChevronLeft class="rtl:rotate-180" />
        </IconButton>
        <Select
          v-model="month"
          :options="options"
          size="sm"
          aria-label="Month"
          class="min-w-0 flex-1"
        />
        <IconButton label="Next month" size="sm" :disabled="!canNext" @click="next">
          <ChevronRight class="rtl:rotate-180" />
        </IconButton>
      </template>
      <template #default="{ isDisabled, isOutside }">
        <Text v-if="!isOutside" size="xs" tone="muted" class="text-center">
          {{ isDisabled ? '—' : 'Open' }}
        </Text>
      </template>
      <template #footer>
        <Text size="xs" tone="muted">
          Available September 10 – November 20. Weeks begin on Sunday.
        </Text>
      </template>
    </MonthGrid>
  </Stack>
</template>
