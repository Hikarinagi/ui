<script setup lang="ts" generic="T = unknown">
  import { Search } from '@lucide/vue'
  import { ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxRoot } from 'reka-ui'
  import { computed, nextTick, shallowRef } from 'vue'
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
    commandStatus,
  } from './command-palette.variants'
  import { provideCommandPalette } from './context'
  import type {
    CommandEmptySlotProps,
    CommandItem,
    CommandItems,
    CommandItemSlotProps,
  } from './types'
  import { useCommandItems } from './composables/useCommandItems'
  import { commandMatchRange } from './utils/match'

  defineOptions({ name: 'HnCommandPalettePanel', inheritAttrs: false })

  const props = defineProps<{
    items: CommandItems<T>
    virtualize?: VirtualizeOptions
    label: string
    placeholder?: string
    ignoreFilter?: boolean
    loading?: boolean
    autoFocus?: boolean
    inline?: boolean
    class?: string
  }>()

  const emit = defineEmits<{ select: [item: CommandItem<T>] }>()

  defineSlots<{
    default?(): unknown
    input?(): unknown
    item?(props: CommandItemSlotProps<T>): unknown
    loading?(): unknown
    empty?(props: CommandEmptySlotProps): unknown
  }>()

  const search = defineModel<string>('search', { default: '' })

  const t = useUiLocale()

  const input = shallowRef<HTMLElement>()
  const { sections, options } = useCommandItems(props, () => search.value)

  function select(item: CommandItem<T>) {
    const field = input.value
    const panel = field?.closest('[data-hn-command-palette]')
    const inside = !!panel?.contains(document.activeElement)
    emit('select', item)
    if (!field || !panel || !inside) return
    void nextTick(() => {
      const active = document.activeElement
      if (!field.isConnected) return
      if (!active || active === document.body || panel.contains(active))
        field.focus({ preventScroll: true })
    })
  }

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
      <ListboxContent
        v-if="props.virtualize"
        as-child
        :aria-label="props.label"
        :aria-busy="props.loading || undefined"
      >
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
              @select="select(option.match.item)"
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
          <template #empty>
            <slot v-if="props.loading" name="loading">{{ t.common.loading }}</slot>
            <slot v-else name="empty" :search="search">{{ t.command.empty }}</slot>
          </template>
        </VirtualChoices>
      </ListboxContent>
      <ScrollArea v-else :class="commandList()">
        <ListboxContent
          :aria-label="props.label"
          :aria-busy="props.loading || undefined"
          :class="selectListBody()"
        >
          <template v-for="section in sections" :key="section.key">
            <ListboxGroup v-if="section.label">
              <ListboxGroupLabel :class="selectLabel()">{{ section.label }}</ListboxGroupLabel>
              <CommandPaletteItem
                v-for="match in section.matches"
                :key="match.item.id"
                :match="match"
                @select="select(match.item)"
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
                @select="select(match.item)"
              >
                <template v-if="$slots.item" #default>
                  <slot name="item" :item="match.item" :match="commandMatchRange(match)" />
                </template>
              </CommandPaletteItem>
            </template>
          </template>
        </ListboxContent>
        <div v-if="sections.length === 0" role="status" :class="commandEmpty()">
          <slot v-if="props.loading" name="loading">{{ t.common.loading }}</slot>
          <slot v-else name="empty" :search="search">{{ t.command.empty }}</slot>
        </div>
      </ScrollArea>
      <div v-if="props.loading && sections.length > 0" role="status" :class="commandStatus()">
        <slot name="loading">{{ t.common.loading }}</slot>
      </div>
    </ListboxRoot>
  </Card>
</template>
