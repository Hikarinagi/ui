<script setup lang="ts" generic="T = unknown">
  import { Search } from '@lucide/vue'
  import { ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxRoot } from 'reka-ui'
  import { computed, shallowRef } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import VirtualChoices from '../virtual-list/VirtualChoices.vue'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import { selectLabel, selectListBody } from '../select/select.variants'
  import CommandPaletteInput from './CommandPaletteInput.vue'
  import CommandPaletteItem from './CommandPaletteItem.vue'
  import {
    commandCard,
    commandEmpty,
    commandInputRow,
    commandList,
  } from './command-palette.variants'
  import { provideCommandPalette } from './context'
  import type { CommandItem, CommandItems, CommandItemSlotProps } from './types'
  import { useCommandItems } from './composables/useCommandItems'
  import { commandMatchRange } from './utils/match'

  defineOptions({ name: 'HnCommandPalettePanel', inheritAttrs: false })

  const props = defineProps<{
    items: CommandItems<T>
    virtualize?: VirtualizeOptions
    label: string
    placeholder?: string
    ignoreFilter?: boolean
    autoFocus?: boolean
    inline?: boolean
    class?: string
  }>()

  const emit = defineEmits<{ select: [item: CommandItem<T>] }>()

  defineSlots<{
    default?(): unknown
    input?(): unknown
    item?(props: CommandItemSlotProps<T>): unknown
  }>()

  const search = defineModel<string>('search', { default: '' })

  const t = useUiLocale()

  const input = shallowRef<HTMLElement>()
  const { sections, options } = useCommandItems(props, () => search.value)

  provideCommandPalette({
    search,
    label: computed(() => props.label),
    placeholder: computed(() => props.placeholder ?? t.value.command.placeholder),
    autoFocus: computed(() => props.autoFocus),
    input,
  })
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
      <slot v-if="$slots.input" name="input" />
      <div v-else :class="commandInputRow()">
        <Search aria-hidden="true" />
        <CommandPaletteInput />
      </div>
      <ListboxContent v-if="props.virtualize" as-child :aria-label="props.label">
        <VirtualChoices
          :options="options"
          :virtualize="props.virtualize"
          :input="input"
          kind="listbox"
          :class="commandList()"
        >
          <template #default="{ option, attrs }">
            <CommandPaletteItem
              v-bind="attrs"
              :match="option.match"
              @select="emit('select', option.match.item)"
            >
              <template v-if="$slots.item" #default>
                <slot
                  name="item"
                  :item="option.match.item"
                  :match="commandMatchRange(option.match)"
                />
              </template>
            </CommandPaletteItem>
          </template>
          <template #empty>{{ t.command.empty }}</template>
        </VirtualChoices>
      </ListboxContent>
      <ScrollArea v-else :class="commandList()">
        <ListboxContent :aria-label="props.label" :class="selectListBody()">
          <template v-for="section in sections" :key="section.key">
            <ListboxGroup v-if="section.label">
              <ListboxGroupLabel :class="selectLabel()">{{ section.label }}</ListboxGroupLabel>
              <CommandPaletteItem
                v-for="match in section.matches"
                :key="match.item.id"
                :match="match"
                @select="emit('select', match.item)"
              >
                <template v-if="$slots.item" #default>
                  <slot name="item" :item="match.item" :match="commandMatchRange(match)" />
                </template>
              </CommandPaletteItem>
            </ListboxGroup>
            <template v-else>
              <CommandPaletteItem
                v-for="match in section.matches"
                :key="match.item.id"
                :match="match"
                @select="emit('select', match.item)"
              >
                <template v-if="$slots.item" #default>
                  <slot name="item" :item="match.item" :match="commandMatchRange(match)" />
                </template>
              </CommandPaletteItem>
            </template>
          </template>
          <div v-if="sections.length === 0" :class="commandEmpty()">{{ t.command.empty }}</div>
        </ListboxContent>
      </ScrollArea>
    </ListboxRoot>
  </Card>
</template>
