<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from 'vue'
  import { Button, Card, Masonry, Skeleton, Stack, Text } from '@hina-ui/vue'
  import { masonryNotes } from '../../masonry'

  const count = ref(6)
  const loading = ref(false)
  const notes = masonryNotes('en')
  const items = computed(() =>
    Array.from({ length: count.value }, (_, id) => ({ ...notes[id % notes.length]!, id })),
  )
  let timer: ReturnType<typeof setTimeout> | undefined

  function reload() {
    clearTimeout(timer)
    count.value = 0
    loading.value = true
    timer = setTimeout(() => {
      count.value = 6
      loading.value = false
    }, 800)
  }
  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Stack class="w-full max-w-2xl">
    <Button class="self-start" variant="outline" size="sm" :disabled="loading" @click="reload">
      Reload to preview pending
    </Button>
    <Masonry
      :items="items"
      :get-key="item => item.id"
      :min-column-width="180"
      :loading="loading"
      label="Initial load of design notes"
    >
      <template #pending>
        <Stack aria-hidden="true" class="block columns-[180px] gap-[var(--hn-masonry-gap)]">
          <Card
            v-for="(lines, index) in [2, 4, 3, 2, 5, 3]"
            :key="index"
            class="mb-[var(--hn-masonry-row-gap)] break-inside-avoid"
          >
            <Stack gap="sm">
              <Skeleton class="h-5 w-2/3 rounded" />
              <Skeleton
                v-for="line in lines"
                :key="line"
                class="h-4 rounded"
                :class="line === lines ? 'w-4/5' : 'w-full'"
              />
            </Stack>
          </Card>
        </Stack>
      </template>
      <template #default="{ item }">
        <Card>
          <Stack gap="sm">
            <Text size="sm" weight="medium">{{ item.title }}</Text>
            <Text size="sm" tone="muted">{{ item.body }}</Text>
          </Stack>
        </Card>
      </template>
    </Masonry>
    <Text size="sm" tone="muted">
      CSS columns arrange varied-height skeletons without measuring on the first SSR paint. Reload
      simulates the first request.
    </Text>
  </Stack>
</template>
