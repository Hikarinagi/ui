<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { SelectRoot, SelectTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { injectInputGroup } from '../input-group/context'
  import { inputEmbedded, inputHost, type InputVariants } from '../input/input.variants'
  import SelectList from './SelectList.vue'
  import { selectTrigger } from './select.variants'
  import { flattenOptions, type SelectItems, type SelectOption } from './types'

  defineOptions({ name: 'HnSelect', inheritAttrs: false })

  const props = defineProps<{
    options: SelectItems
    placeholder?: string
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<string | number | null>()
  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    value(props: { option: SelectOption }): unknown
    option(props: { option: SelectOption }): unknown
  }>()

  const t = useUiLocale()
  const group = injectInputGroup()
  const keyboard = ref(false)

  const disabled = computed(() => props.disabled || !!group?.disabled.value)
  const invalid = computed(() => props.invalid || !!group?.invalid.value)
  const selected = computed(() =>
    flattenOptions(props.options).find(option => option.value === model.value),
  )
</script>

<template>
  <SelectRoot v-model="model" v-model:open="open" :disabled="disabled">
    <SelectTrigger
      v-bind="$attrs"
      data-hn-select
      @keydown="keyboard = true"
      @pointerdown="keyboard = false"
      :data-invalid="invalid ? '' : undefined"
      :aria-invalid="invalid || undefined"
      :class="
        cn(
          group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
          selectTrigger(),
          props.class,
        )
      "
    >
      <span class="min-w-0 flex-1 truncate">
        <template v-if="selected">
          <slot name="value" :option="selected">{{ selected.label }}</slot>
        </template>
        <template v-else>{{ props.placeholder ?? t.select.placeholder }}</template>
      </span>
      <DisclosureIcon class="text-muted" />
    </SelectTrigger>
    <SelectList :options="props.options" :keyboard="keyboard">
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>
    </SelectList>
  </SelectRoot>
</template>
