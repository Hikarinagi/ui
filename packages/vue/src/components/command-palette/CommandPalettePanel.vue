<script setup lang="ts">
  import { Search } from '@lucide/vue'
  import {
    ListboxContent,
    ListboxFilter,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxRoot,
  } from 'reka-ui'
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectLabel, selectListBody } from '../select/select.variants'
  import CommandPaletteItem from './CommandPaletteItem.vue'
  import {
    commandCard,
    commandEmpty,
    commandInput,
    commandInputRow,
    commandList,
  } from './command-palette.variants'
  import type { CommandItem, CommandItems } from './types'
  import { filterCommands } from './utils/match'

  defineOptions({ name: 'HnCommandPalettePanel', inheritAttrs: false })

  const props = defineProps<{
    items: CommandItems
    label: string
    placeholder?: string
    ignoreFilter?: boolean
    autoFocus?: boolean
    inline?: boolean
    class?: string
  }>()

  const emit = defineEmits<{ select: [item: CommandItem] }>()

  const search = defineModel<string>('search', { default: '' })

  const t = useUiLocale()

  const sections = computed(() =>
    filterCommands(props.items, props.ignoreFilter ? '' : search.value),
  )
</script>

<template>
  <Card
    v-bind="$attrs"
    data-hn-command-palette
    :padded="false"
    :class="cn(commandCard({ inline: props.inline }), props.class)"
  >
    <slot />
    <ListboxRoot selection-behavior="replace" highlight-on-hover class="flex min-h-0 flex-col">
      <div :class="commandInputRow()">
        <Search aria-hidden="true" />
        <ListboxFilter
          v-model="search"
          :auto-focus="props.autoFocus"
          :placeholder="props.placeholder ?? t.command.placeholder"
          :aria-label="props.label"
          :class="commandInput()"
        />
      </div>
      <ScrollArea :class="commandList()">
        <ListboxContent :aria-label="props.label" :class="selectListBody()">
          <template v-for="section in sections" :key="section.key">
            <ListboxGroup v-if="section.label">
              <ListboxGroupLabel :class="selectLabel()">{{ section.label }}</ListboxGroupLabel>
              <CommandPaletteItem
                v-for="match in section.matches"
                :key="match.item.id"
                :match="match"
                @select="emit('select', match.item)"
              />
            </ListboxGroup>
            <template v-else>
              <CommandPaletteItem
                v-for="match in section.matches"
                :key="match.item.id"
                :match="match"
                @select="emit('select', match.item)"
              />
            </template>
          </template>
          <div v-if="sections.length === 0" :class="commandEmpty()">{{ t.command.empty }}</div>
        </ListboxContent>
      </ScrollArea>
    </ListboxRoot>
  </Card>
</template>
