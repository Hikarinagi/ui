<script setup lang="ts" generic="T = unknown">
  import {
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
    VisuallyHidden,
  } from 'reka-ui'
  import { computed, watch } from 'vue'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import { useUiLocale } from '../../locale'
  import CommandPalettePanel from './CommandPalettePanel.vue'
  import { useHotkey } from './composables/useHotkey'
  import { commandWrapper } from './command-palette.variants'
  import type {
    CommandEmptySlotProps,
    CommandItem,
    CommandItems,
    CommandItemSlotProps,
  } from './types'

  defineOptions({ name: 'HnCommandPalette', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      items: CommandItems<T>
      virtualize?: VirtualizeOptions
      placeholder?: string
      label?: string
      hotkey?: string
      ignoreFilter?: boolean
      loading?: boolean
      closeOnSelect?: boolean
      inline?: boolean
      class?: string
    }>(),
    { closeOnSelect: true },
  )

  const emit = defineEmits<{ select: [item: CommandItem<T>] }>()

  defineSlots<{
    default?(): unknown
    input?(): unknown
    item?(props: CommandItemSlotProps<T>): unknown
    loading?(): unknown
    empty?(props: CommandEmptySlotProps): unknown
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const search = defineModel<string>('search', { default: '' })

  const t = useUiLocale()

  const label = computed(() => props.label ?? t.value.command.label)

  useHotkey(
    () => (props.inline ? undefined : props.hotkey),
    () => {
      open.value = !open.value
    },
  )

  watch(open, value => {
    if (!value) search.value = ''
  })

  function select(item: CommandItem<T>) {
    item.onSelect?.()
    emit('select', item)
    if (!props.inline && (item.closeOnSelect ?? props.closeOnSelect)) open.value = false
  }
</script>

<template>
  <CommandPalettePanel
    v-if="props.inline"
    v-bind="$attrs"
    v-model:search="search"
    inline
    :items="props.items"
    :virtualize="props.virtualize"
    :label="label"
    :placeholder="props.placeholder"
    :ignore-filter="props.ignoreFilter"
    :loading="props.loading"
    :class="props.class"
    @select="select"
  >
    <template v-if="$slots.input" #input><slot name="input" /></template>
    <template v-if="$slots.item" #item="slotProps">
      <slot name="item" v-bind="slotProps" />
    </template>
    <template v-if="$slots.loading" #loading><slot name="loading" /></template>
    <template v-if="$slots.empty" #empty="slotProps">
      <slot name="empty" v-bind="slotProps" />
    </template>
  </CommandPalettePanel>
  <DialogRoot v-else v-model:open="open">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="hn-scrim" />
      <div :class="commandWrapper()">
        <DialogContent as-child>
          <CommandPalettePanel
            v-bind="$attrs"
            v-model:search="search"
            auto-focus
            :items="props.items"
            :virtualize="props.virtualize"
            :label="label"
            :placeholder="props.placeholder"
            :ignore-filter="props.ignoreFilter"
            :loading="props.loading"
            :class="props.class"
            @select="select"
          >
            <VisuallyHidden>
              <DialogTitle>{{ label }}</DialogTitle>
            </VisuallyHidden>
            <template v-if="$slots.input" #input><slot name="input" /></template>
            <template v-if="$slots.item" #item="slotProps">
              <slot name="item" v-bind="slotProps" />
            </template>
            <template v-if="$slots.loading" #loading><slot name="loading" /></template>
            <template v-if="$slots.empty" #empty="slotProps">
              <slot name="empty" v-bind="slotProps" />
            </template>
          </CommandPalettePanel>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
