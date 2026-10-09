<script setup lang="ts">
  import { ListboxFilter } from 'reka-ui'
  import { shallowRef, watchEffect } from 'vue'
  import { cn } from '../../lib/cn'
  import { commandInput } from './command-palette.variants'
  import { injectCommandPalette } from './context'

  defineOptions({ name: 'HnCommandPaletteInput' })

  const props = defineProps<{
    placeholder?: string
    class?: string
  }>()

  const context = injectCommandPalette()
  const filter = shallowRef<{ $el: HTMLElement }>()

  watchEffect(() => {
    context.input.value = filter.value?.$el
  })
</script>

<template>
  <ListboxFilter
    ref="filter"
    v-model="context.search.value"
    :auto-focus="context.autoFocus.value"
    :placeholder="props.placeholder ?? context.placeholder.value"
    :aria-label="context.label.value"
    :class="props.class ? cn(commandInput(), props.class) : commandInput()"
  />
</template>
