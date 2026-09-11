<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { computed } from 'vue'
  import { ComboboxAnchor, ComboboxInput, ComboboxRoot, ComboboxTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useUiLocale } from '../../locale'
  import { buttonIconBox } from '../button/button.variants'
  import IconSlot from '../button/IconSlot.vue'
  import Chip from '../chip/Chip.vue'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import ComboboxList from '../combobox/ComboboxList.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import {
    inputActionSlot,
    inputAdornment,
    inputHost,
    inputIndicator,
    type InputVariants,
  } from '../input/input.variants'
  import type { SelectItems, SelectOption } from '../select/types'
  import { useMultiCombobox } from './composables/useMultiCombobox'
  import {
    tagsInputChip,
    tagsInputControl,
    tagsInputHost,
    tagsInputList,
  } from '../tags-input/tags-input.variants'
  import { multiComboboxEnd, multiComboboxHost } from './multi-combobox.variants'

  defineOptions({ name: 'HnMultiCombobox', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      options: SelectItems<T>
      placeholder?: string
      ignoreFilter?: boolean
      loading?: boolean
      clearable?: boolean
      name?: string
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { clearable: false },
  )
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<Array<string | number>>({ default: () => [] })
  const search = defineModel<string>('search', { default: '' })
  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{ option?(props: { option: T }): unknown }>()

  const t = useUiLocale()

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })

  const { selected, keyboard, input, remove, clear, onHostClick, onInputKeydown } =
    useMultiCombobox({
      options: () => props.options,
      model,
      open,
      disabled: () => disabled.value,
      onClear: () => emit('clear'),
    })
  const chipSize = computed(() => (props.size === 'sm' ? 'sm' : 'md'))
  const clearing = computed(() => props.clearable && selected.value.length > 0 && !disabled.value)
</script>

<template>
  <ComboboxRoot
    v-model="model"
    v-model:open="open"
    :disabled="disabled"
    :ignore-filter="props.ignoreFilter"
    :name="props.name"
    multiple
    open-on-click
  >
    <ComboboxAnchor as-child>
      <div
        data-hn-multi-combobox
        :data-invalid="invalid ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :aria-busy="props.loading || undefined"
        :class="
          cn(
            inputHost({ variant: props.variant, size: props.size }),
            tagsInputHost({ size: props.size, trailing: true }),
            multiComboboxHost({ clearing }),
            props.class,
          )
        "
        @click="onHostClick"
      >
        <div :class="tagsInputList()">
          <Chip
            v-for="option in selected"
            :key="option.value"
            :size="chipSize"
            removable
            :disabled="disabled"
            :class="tagsInputChip()"
            @remove="remove(option.value)"
          >
            <span class="min-w-0 truncate">{{ option.label }}</span>
          </Chip>
          <ComboboxInput
            ref="input"
            v-bind="$attrs"
            v-model="search"
            :placeholder="
              selected.length ? undefined : (props.placeholder ?? t.combobox.placeholder)
            "
            :disabled="disabled"
            :id="fieldId"
            :aria-invalid="invalid || undefined"
            :aria-describedby="describedBy"
            :class="tagsInputControl({ size: props.size })"
            @keydown="onInputKeydown"
          />
        </div>
        <span :class="multiComboboxEnd()">
          <Transition
            enter-active-class="hn-transition-base"
            enter-from-class="scale-90 opacity-0"
            leave-active-class="hn-transition"
            leave-to-class="scale-90 opacity-0"
          >
            <span v-if="clearing" data-hn-multi-combobox-clear :class="inputActionSlot()">
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
              :box-class="buttonIconBox({ size: props.size })"
              :swapped="!!props.loading"
              spinner-size="sm"
            >
              <DisclosureIcon :open="open" />
            </IconSlot>
          </ComboboxTrigger>
        </span>
      </div>
    </ComboboxAnchor>
    <ComboboxList :options="props.options" :keyboard="keyboard">
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>
    </ComboboxList>
  </ComboboxRoot>
</template>
