<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { refDebounced } from '@vueuse/core'
  import { useRuntimeConfig } from '#app'
  import { Search } from '@lucide/vue'
  import {
    Autocomplete,
    FormField,
    Stack,
    Text,
    type AutocompleteOption,
    type CompletionContext,
  } from '@hina-ui/vue'

  const text = ref('')
  const search = ref('')
  const keyword = refDebounced(search, 250)
  const options = ref<AutocompleteOption[]>([])
  const loading = ref(false)
  const error = ref(false)
  const baseURL = useRuntimeConfig().app.baseURL

  function query(context: CompletionContext) {
    if (search.value === context.text) return
    search.value = context.text
    options.value = []
    loading.value = !!context.text.trim()
    error.value = false
  }

  watch(keyword, async (value, _, onCleanup) => {
    const controller = new AbortController()
    onCleanup(() => controller.abort())
    if (!value.trim()) {
      options.value = []
      loading.value = false
      return
    }
    loading.value = true
    error.value = false
    try {
      const response = await fetch(`${baseURL}demo/tags.json`, { signal: controller.signal })
      if (!response.ok) throw new Error(String(response.status))
      const result = (await response.json()) as {
        data: { items: { id: number; name: string; nameEn: string }[] }
      }
      if (controller.signal.aborted || search.value !== value) return
      options.value = result.data.items
        .filter(tag => (tag.nameEn || tag.name).toLowerCase().includes(value.trim().toLowerCase()))
        .slice(0, 10)
        .map(tag => ({ value: tag.id, label: tag.nameEn || tag.name }))
    } catch {
      if (!controller.signal.aborted && search.value === value) error.value = true
    } finally {
      if (!controller.signal.aborted && search.value === value) loading.value = false
    }
  })
</script>

<template>
  <Stack class="w-full max-w-sm">
    <FormField
      label="Tag search"
      description="Fetch suggestions while typing; arbitrary text is also accepted."
    >
      <Autocomplete
        v-model="text"
        :options="options"
        :loading="loading"
        placeholder="Try novel or music"
        @query="query"
      >
        <template #leading><Search /></template>
        <template #empty>
          {{
            error
              ? 'Could not load suggestions. Edit the text to retry.'
              : text.trim()
                ? 'No suggestions. You can still use this text.'
                : 'Type to search for tags.'
          }}
        </template>
      </Autocomplete>
    </FormField>
    <Text tone="muted" size="sm">Text: {{ text || '—' }}</Text>
  </Stack>
</template>
