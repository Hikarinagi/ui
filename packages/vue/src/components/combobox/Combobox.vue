<script setup lang="ts">
  import { computed, ref, shallowRef, watch } from 'vue'
  import { ComboboxAnchor, ComboboxInput, ComboboxRoot, ComboboxTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
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
  import { flattenOptions, type SelectItems, type SelectOption } from '../select/types'
  import ComboboxList from './ComboboxList.vue'

  defineOptions({ name: 'HnCombobox', inheritAttrs: false })

  const props = defineProps<{
    options: SelectItems
    placeholder?: string
    ignoreFilter?: boolean
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

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()

  const t = useUiLocale()
  const group = injectInputGroup()
  const keyboard = ref(false)
  const input = shallowRef<{ $el: HTMLInputElement } | null>(null)

  const size = computed(() => (group ? group.size.value : props.size))
  const disabled = computed(() => props.disabled || !!group?.disabled.value)
  const invalid = computed(() => props.invalid || !!group?.invalid.value)
  const clearing = computed(
    () => !!props.clearable && model.value != null && model.value !== '' && !disabled.value,
  )

  function displayValue(value: string | number | null | undefined) {
    return flattenOptions(props.options).find(option => option.value === value)?.label ?? ''
  }

  function clear() {
    model.value = null
    search.value = ''
    emit('clear')
    input.value?.$el.focus()
  }

  watch(search, value => {
    if (value === '' && model.value != null) model.value = null
  })

  watch(open, value => {
    if (!value) keyboard.value = false
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
        :class="
          cn(
            group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
            props.class,
          )
        "
        @click="focusFieldFrom($event.currentTarget as HTMLElement, $event.target as HTMLElement)"
        @keydown="keyboard = true"
      >
        <ComboboxInput
          ref="input"
          v-bind="$attrs"
          v-model="search"
          :display-value="displayValue"
          :placeholder="props.placeholder ?? t.combobox.placeholder"
          :disabled="disabled"
          :aria-invalid="invalid || undefined"
          :class="inputControl({ trailing: true })"
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
          <DisclosureIcon :open="open" />
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>
    <ComboboxList :options="props.options" :keyboard="keyboard">
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>
    </ComboboxList>
  </ComboboxRoot>
</template>
