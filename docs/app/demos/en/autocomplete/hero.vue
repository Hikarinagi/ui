<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from '@lucide/vue'
  import {
    Autocomplete,
    Tag,
    Kbd,
    Stack,
    Text,
    type AutocompleteOption,
    type CompletionContext,
    type CompletionEdit,
  } from '@hina-ui/vue'
  import { queryToken, queryValues } from '../../autocomplete'

  const text = ref('entry:http ')
  const applied = ref('entry:http ')
  const options = ref<AutocompleteOption[]>([])
  const descriptions: Record<string, string> = {
    entry: 'Entry type',
    status: 'Request status',
    duration: 'Request duration',
    service: 'Service name',
  }

  function query(context: CompletionContext) {
    const token = queryToken(context)
    const values = token.key ? (queryValues[token.key] ?? []) : Object.keys(queryValues)
    options.value = values
      .filter(value => value.startsWith(token.prefix))
      .map(value => ({
        value,
        label: token.key ? value : `${value}:`,
        description: token.key ? undefined : descriptions[value],
      }))
  }

  function complete(option: AutocompleteOption, context: CompletionContext): CompletionEdit {
    const token = queryToken(context)
    return { range: token.range, text: option.label, keepOpen: !token.key }
  }
</script>

<template>
  <Stack class="w-full max-w-lg">
    <Autocomplete
      v-model="text"
      :options="options"
      :get-completion="complete"
      select-on-tab
      aria-label="Request query"
      placeholder="entry:http status:error duration:>500ms"
      @query="query"
      @submit="applied = $event"
    >
      <template #leading><Search /></template>
      <template #trailing>
        <Tag v-if="text !== applied" size="sm" tone="warning" class="mx-2 whitespace-nowrap">
          Unapplied
        </Tag>
        <Kbd v-else class="mx-2">Enter</Kbd>
      </template>
    </Autocomplete>
    <Text tone="muted" size="sm">
      Type sta, choose status:, then choose error. Enter without a highlighted suggestion applies
      the query.
    </Text>
    <Text size="sm" class="break-all">Applied: {{ applied || '—' }}</Text>
  </Stack>
</template>
