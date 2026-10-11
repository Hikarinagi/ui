<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, shallowRef, toRef, useAttrs, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useDirection } from '../../primitives/utils/useDirection'
  import {
    createPinInput,
    pinCells,
    pinInputValue,
    type PinInputController,
    type PinInputSelection,
  } from '../../../../shared/src/primitives/pin-input'
  import {
    pinInput,
    pinInputCaret,
    pinInputCell,
    pinInputNative,
    type PinInputVariants,
  } from './pin-input.variants'

  defineOptions({ name: 'HnPinInput', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      length?: number
      type?: 'text' | 'number'
      mask?: boolean
      otp?: boolean
      placeholder?: string
      name?: string
      variant?: PinInputVariants['variant']
      size?: PinInputVariants['size']
      disabled?: boolean
      invalid?: boolean
      required?: boolean
      dir?: 'ltr' | 'rtl'
      class?: string
    }>(),
    { length: 6, type: 'text', placeholder: '' },
  )

  const emit = defineEmits<{ complete: [value: string] }>()

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const dir = useDirection(toRef(props, 'dir'))
  const { id, labelledBy, invalid, disabled, describedBy } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })

  const root = shallowRef<HTMLElement | null>(null)
  const input = shallowRef<HTMLInputElement | null>(null)
  const selection = shallowRef<PinInputSelection>({ focused: false, start: 0, end: 0 })
  const shown = computed(() => pinInputValue(model.value ?? '', props.length))
  const cells = computed(() => pinCells(shown.value, props.length, selection.value))
  const rest = computed(() => {
    const {
      id: _id,
      autofocus: _autofocus,
      'aria-label': _label,
      'aria-labelledby': _labelledBy,
      'aria-describedby': _describedBy,
      ...other
    } = attrs
    return other
  })

  let controller: PinInputController | undefined

  onMounted(() => {
    controller = createPinInput(input.value!, {
      length: () => props.length,
      numeric: () => props.type === 'number',
      value: () => model.value ?? '',
      rtl: () => dir.value === 'rtl',
      cells: () => root.value!.querySelectorAll('[data-hn-pin-cell]'),
      change: value => {
        model.value = value
      },
      select: value => {
        selection.value = value
      },
    })
  })
  onBeforeUnmount(() => controller?.dispose())

  watch([shown, () => props.type], () => controller?.sync(), { flush: 'post' })
  watch(model, value => {
    if ((value ?? '').length >= props.length) emit('complete', pinInputValue(value, props.length))
  })
</script>

<template>
  <div
    v-bind="rest"
    ref="root"
    :dir="dir"
    data-hn-pin-input
    data-hn-field-group
    :data-complete="shown.length >= props.length ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? '' : undefined"
    :class="cn(pinInput({ size: props.size }), props.class)"
  >
    <div
      v-for="(cell, index) in cells"
      :key="index"
      data-hn-pin-cell
      aria-hidden="true"
      :data-filled="cell.char ? '' : undefined"
      :data-state="cell.active ? 'active' : undefined"
      :data-disabled="disabled ? '' : undefined"
      :data-invalid="invalid ? '' : undefined"
      :class="pinInputCell({ variant: props.variant, size: props.size })"
    >
      <span v-if="cell.caret" :class="pinInputCaret()" />
      <template v-else>
        {{ cell.char ? (props.mask ? '•' : cell.char) : props.placeholder }}
      </template>
    </div>
    <input
      :id="id"
      ref="input"
      :type="props.mask ? 'password' : 'text'"
      :name="props.name"
      :value.attr="shown"
      :inputmode="props.type === 'number' ? 'numeric' : 'text'"
      :pattern="props.type === 'number' ? '[0-9]*' : undefined"
      :autocomplete="props.otp ? 'one-time-code' : 'off'"
      autocapitalize="none"
      autocorrect="off"
      spellcheck="false"
      :autofocus="(attrs.autofocus as boolean | undefined) || undefined"
      :disabled="disabled"
      :required="props.required || undefined"
      :aria-label="attrs['aria-label'] as string | undefined"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :aria-invalid="invalid || undefined"
      :class="pinInputNative()"
    />
  </div>
</template>
