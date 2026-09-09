<script setup lang="ts">
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
  import { useUiLocale } from '../../locale'
  import CommandPalettePanel from './CommandPalettePanel.vue'
  import { useHotkey } from './composables/useHotkey'
  import { commandWrapper } from './command-palette.variants'
  import type { CommandItem, CommandItems } from './types'

  defineOptions({ name: 'HnCommandPalette', inheritAttrs: false })

  const props = defineProps<{
    items: CommandItems
    placeholder?: string
    label?: string
    hotkey?: string
    ignoreFilter?: boolean
    inline?: boolean
    class?: string
  }>()

  const emit = defineEmits<{ select: [item: CommandItem] }>()

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

  function select(item: CommandItem) {
    item.onSelect?.()
    emit('select', item)
    if (!props.inline) open.value = false
  }
</script>

<template>
  <CommandPalettePanel
    v-if="props.inline"
    v-bind="$attrs"
    v-model:search="search"
    inline
    :items="props.items"
    :label="label"
    :placeholder="props.placeholder"
    :ignore-filter="props.ignoreFilter"
    :class="props.class"
    @select="select"
  />
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
            :label="label"
            :placeholder="props.placeholder"
            :ignore-filter="props.ignoreFilter"
            :class="props.class"
            @select="select"
          >
            <VisuallyHidden>
              <DialogTitle>{{ label }}</DialogTitle>
            </VisuallyHidden>
          </CommandPalettePanel>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
