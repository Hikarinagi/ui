<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { refDebounced, useFetch } from '@vueuse/core'
  import { useRuntimeConfig } from '#app'
  import { Inline, MultiCombobox, Stack, Text } from '@hina-ui/vue'

  interface TagPage {
    data: { items: Array<{ id: number; name: string; nameEn: string }> }
  }

  const selectedTags = [
    { value: 31, label: 'Light novels' },
    { value: 32, label: 'Tappei Nagatsuki' },
    { value: 33, label: 'Time travel' },
  ]
  const selected = ref<Array<string | number>>(selectedTags.map(tag => tag.value))
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
          tag.nameEn.toLocaleLowerCase().includes(keyword.value.trim().toLocaleLowerCase()),
        )
        .slice(0, 10)
        .map(tag => ({ value: tag.id, label: tag.nameEn })) ?? [],
  )

  onMounted(() => execute())
</script>

<template>
  <Stack class="w-80">
    <MultiCombobox
      v-model="selected"
      v-model:search="search"
      :options="options"
      :selected-options="selectedTags"
      :loading="isFetching"
      ignore-filter
      placeholder="Search tags"
      aria-label="Tags"
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
    <Text tone="muted">Selected: {{ selected.length }} · Results: {{ options.length }}</Text>
  </Stack>
</template>
