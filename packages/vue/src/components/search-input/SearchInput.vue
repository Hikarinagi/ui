<script setup lang="ts">
  import { Search } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import InputBase from '../input/InputBase.vue'
  import type { TextInputVariants } from '../input/input.variants'

  defineOptions({ name: 'HnSearchInput', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      variant?: TextInputVariants['variant']
      size?: TextInputVariants['size']
      clearable?: boolean
      loading?: boolean
      disabled?: boolean
      class?: string
    }>(),
    { clearable: true },
  )
  const emit = defineEmits<{ search: [value: string]; clear: [] }>()

  const model = defineModel<string>({ default: '' })

  function onEscape(event: KeyboardEvent) {
    if (!model.value) return
    event.preventDefault()
    model.value = ''
    emit('clear')
  }
</script>

<template>
  <InputBase
    type="search"
    enterkeyhint="search"
    v-bind="$attrs"
    v-model="model"
    :variant="props.variant"
    :size="props.size"
    :clearable="props.clearable"
    :loading="props.loading"
    :disabled="props.disabled"
    :class="
      cn(
        '[&_input]:appearance-none [&_input::-webkit-search-cancel-button]:appearance-none [&_input::-webkit-search-decoration]:appearance-none',
        props.class,
      )
    "
    @keydown.enter="emit('search', model)"
    @keydown.esc="onEscape"
    @clear="emit('clear')"
  >
    <template #leading>
      <Search />
    </template>
  </InputBase>
</template>
