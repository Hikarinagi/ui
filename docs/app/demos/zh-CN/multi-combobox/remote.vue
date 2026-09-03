<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { refDebounced, useFetch } from '@vueuse/core'
  import { Inline, MultiCombobox, Text } from '@hina-ui/vue'

  interface TagPage {
    data: { items: Array<{ id: number; name: string }> }
  }

  const selected = ref<Array<string | number>>([])
  const search = ref('')
  const keyword = refDebounced(search, 300)
  const url = computed(
    () =>
      `/api/demo/tags?${new URLSearchParams({ search: keyword.value, page: '1', page_size: '10' })}`,
  )
  const { data, isFetching, execute } = useFetch(url, {
    refetch: true,
    immediate: false,
  }).json<TagPage>()
  const options = computed(
    () => data.value?.data.items.map(tag => ({ value: tag.id, label: tag.name })) ?? [],
  )

  onMounted(() => execute())
</script>

<template>
  <MultiCombobox
    v-model="selected"
    v-model:search="search"
    :options="options"
    :loading="isFetching"
    ignore-filter
    placeholder="搜索标签"
    aria-label="标签"
    class="w-80"
  >
    <template #option="{ option }">
      <Inline gap="sm" align="center" :wrap="false" class="min-w-0">
        <Text as="span" class="truncate">{{ option.label }}</Text>
        <Text as="span" tone="muted" size="xs" class="ms-auto shrink-0 font-mono">
          #{{ option.value }}
        </Text>
      </Inline>
    </template>
  </MultiCombobox>
</template>
