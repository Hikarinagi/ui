<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { refDebounced, useFetch } from '@vueuse/core'
  import { useRuntimeConfig } from '#app'
  import { Combobox, Stack, Text } from '@hina-ui/vue'

  interface TagPage {
    data: { items: Array<{ id: number; name: string; nameEn: string }> }
  }

  const selectedOption = { value: 31, label: '轻小说' }
  const selected = ref<string | number | null>(selectedOption.value)
  const baseURL = useRuntimeConfig().app.baseURL
  const search = ref('')
  const keyword = refDebounced(search, 300)
  const url = computed(
    () => `${baseURL}demo/tags.json?${new URLSearchParams({ search: keyword.value })}`,
  )
  const { data, isFetching, execute } = useFetch(url, {
    refetch: true,
    immediate: false,
  }).json<TagPage>()
  const options = computed(
    () =>
      data.value?.data.items
        .filter(tag =>
          tag.name.toLocaleLowerCase().includes(keyword.value.trim().toLocaleLowerCase()),
        )
        .slice(0, 10)
        .map(tag => ({ value: tag.id, label: tag.name })) ?? [],
  )

  onMounted(() => execute())
</script>

<template>
  <Stack class="w-64">
    <Combobox
      v-model="selected"
      v-model:search="search"
      :options="options"
      :selected-option="selectedOption"
      :loading="isFetching"
      ignore-filter
      clearable
      placeholder="搜索标签"
      aria-label="标签"
    />
    <Text tone="muted">候选：{{ options.length }} · 选中值：{{ selected ?? '无' }}</Text>
  </Stack>
</template>
