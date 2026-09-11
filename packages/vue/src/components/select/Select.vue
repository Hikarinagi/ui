<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { computed, ref, shallowRef } from 'vue'
  import { SelectRoot, SelectTrigger, useDirection } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputAdornment,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import SelectList from './SelectList.vue'
  import { selectButton } from './select.variants'
  import { flattenOptions, type SelectItems, type SelectOption } from './types'

  defineOptions({ name: 'HnSelect', inheritAttrs: false })

  const props = defineProps<{
    options: SelectItems<T>
    placeholder?: string
    clearable?: boolean
    name?: string
    required?: boolean
    autocomplete?: string
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<string | number | null>()
  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    value?(props: { option: T }): unknown
    option?(props: { option: T }): unknown
  }>()

  const t = useUiLocale()
  const group = injectInputGroup()
  const direction = useDirection()
  const keyboard = ref(false)
  const host = shallowRef<HTMLElement | null>(null)
  const trigger = shallowRef<{ $el: HTMLElement } | null>(null)

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })
  const selected = computed(() =>
    flattenOptions(props.options).find(option => option.value === model.value),
  )
  const clearing = computed(
    () => !!props.clearable && model.value != null && model.value !== '' && !disabled.value,
  )

  function clear() {
    if (disabled.value || model.value == null || model.value === '') return
    model.value = null
    emit('clear')
    trigger.value?.$el.focus()
  }
</script>

<template>
  <SelectRoot
    v-model="model"
    v-model:open="open"
    :disabled="disabled"
    :name="props.name"
    :required="props.required"
    :autocomplete="props.autocomplete"
  >
    <div
      ref="host"
      :dir="direction"
      data-hn-select
      :data-invalid="invalid ? '' : undefined"
      :data-disabled="disabled ? '' : undefined"
      :class="
        cn(
          group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
          'relative cursor-pointer',
          props.class,
        )
      "
    >
      <SelectTrigger
        ref="trigger"
        v-bind="$attrs"
        :reference="host ?? undefined"
        :id="fieldId"
        :aria-describedby="describedBy"
        :aria-invalid="invalid || undefined"
        data-hn-select-trigger
        @keydown="keyboard = true"
        @pointerdown="keyboard = false"
        :class="selectButton()"
      >
        <span :class="cn('min-w-0 flex-1 truncate', clearing && 'pe-[var(--hn-input-h)]')">
          <template v-if="selected">
            <slot name="value" :option="selected">{{ selected.label }}</slot>
          </template>
          <template v-else>{{ props.placeholder ?? t.select.placeholder }}</template>
        </span>
        <span :class="inputAdornment()">
          <DisclosureIcon />
        </span>
      </SelectTrigger>
      <InputAction
        v-if="clearing"
        data-hn-select-clear
        :label="t.common.clear"
        class="absolute inset-y-0 end-[var(--hn-input-h)]"
        @click="clear"
      >
        <X />
      </InputAction>
    </div>
    <SelectList :options="props.options" :keyboard="keyboard">
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>
    </SelectList>
  </SelectRoot>
</template>
