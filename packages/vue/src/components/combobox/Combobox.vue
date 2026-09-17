<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { computed } from 'vue'
  import { ComboboxAnchor, ComboboxInput, ComboboxRoot, ComboboxTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import type { VirtualizeOptions } from '../../lib/virtual/types'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import IconSlot from '../button/IconSlot.vue'
  import { buttonIconBox } from '../button/button.variants'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputActionSlot,
    inputAdornment,
    inputControl,
    inputEmbedded,
    inputHost,
    inputIndicator,
    type InputVariants,
  } from '../input/input.variants'
  import type { SelectItems, SelectOption } from '../select/types'
  import { useCombobox } from './composables/useCombobox'
  import ComboboxList from './ComboboxList.vue'

  defineOptions({ name: 'HnCombobox', inheritAttrs: false })

  const props = defineProps<{
    options: SelectItems<T>
    virtualize?: VirtualizeOptions
    selectedOption?: T | null
    placeholder?: string
    ignoreFilter?: boolean
    loading?: boolean
    clearable?: boolean
    variant?: InputVariants['variant']
    size?: InputVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<string | number | null>()
  const search = defineModel<string>('search', { default: '' })
  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{ option?(props: { option: T }): unknown }>()

  const t = useUiLocale()
  const group = injectInputGroup()

  const size = computed(() => (group ? group.size.value : props.size))
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })
  const clearing = computed(
    () => !!props.clearable && model.value != null && model.value !== '' && !disabled.value,
  )

  const { keyboard, input, inputValue, displayValue, clear, onInput, onHostClick } = useCombobox({
    options: () => props.options,
    selectedOption: () => props.selectedOption,
    model,
    search,
    open,
    disabled: () => disabled.value,
    onClear: () => emit('clear'),
  })
</script>

<template>
  <ComboboxRoot
    v-model="model"
    v-model:open="open"
    :disabled="disabled"
    :ignore-filter="props.ignoreFilter"
    open-on-click
  >
    <ComboboxAnchor as-child>
      <div
        data-hn-combobox
        :data-invalid="invalid ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :aria-busy="props.loading || undefined"
        :class="
          cn(
            group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
            props.class,
          )
        "
        @click="onHostClick"
        @keydown="keyboard = true"
      >
        <ComboboxInput
          ref="input"
          v-bind="$attrs"
          v-model="inputValue"
          :id="fieldId"
          :aria-describedby="describedBy"
          :display-value="displayValue"
          :placeholder="props.placeholder ?? t.combobox.placeholder"
          :disabled="disabled"
          :aria-invalid="invalid || undefined"
          :class="inputControl({ trailing: true })"
          @input="onInput"
        />
        <Transition
          enter-active-class="hn-transition-base"
          enter-from-class="scale-90 opacity-0"
          leave-active-class="hn-transition"
          leave-to-class="scale-90 opacity-0"
        >
          <span v-if="clearing" data-hn-combobox-clear :class="inputActionSlot()">
            <InputAction :label="t.common.clear" @click="clear">
              <X />
            </InputAction>
          </span>
        </Transition>
        <ComboboxTrigger
          :aria-label="t.combobox.toggle"
          :disabled="disabled"
          :class="cn(inputAdornment(), inputIndicator())"
          @mousedown.prevent
        >
          <IconSlot
            :box-class="buttonIconBox({ size })"
            :swapped="!!props.loading"
            spinner-size="sm"
          >
            <DisclosureIcon :open="open" />
          </IconSlot>
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>
    <ComboboxList :options="props.options" :keyboard="keyboard" :virtualize="props.virtualize">
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>
    </ComboboxList>
  </ComboboxRoot>
</template>
