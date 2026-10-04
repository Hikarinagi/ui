<script lang="ts">
  export interface NumberFieldRootProps extends PrimitiveProps {
    defaultValue?: number
    modelValue?: number | null
    min?: number
    max?: number
    step?: number
    stepSnapping?: boolean
    focusOnChange?: boolean
    formatOptions?: Intl.NumberFormatOptions
    locale?: string
    disabled?: boolean
    readonly?: boolean
    disableWheelChange?: boolean
    invertWheelChange?: boolean
    id?: string
    name?: string
    required?: boolean
  }

  export type NumberFieldRootEmits = {
    'update:modelValue': [val: number]
  }
</script>

<script setup lang="ts">
  import {
    computed,
    createCommentVNode,
    h,
    ref,
    toRefs,
    type FunctionalComponent,
    type Ref,
  } from 'vue'
  import { injectConfigProviderContext } from '../utils/config'
  import {
    boundNumberFieldValue,
    commitNumberFieldText,
    createNumberFieldFormat,
    formatNumberFieldValue,
    isNumberFieldAtLimit,
    numberFieldInputMode,
    numberFieldRootAttributes,
    resolveNumberFieldLocale,
    stepNumberFieldText,
    type NumberFieldBound,
    type NumberFieldRange,
    type NumberFieldStep,
  } from '../../../../shared/src/primitives/number-field'
  import { usePrimitiveElement } from '../utils/usePrimitiveElement'
  import { useVModel } from '../utils/useVModel'
  import VisuallyHiddenInput from '../visually-hidden/VisuallyHiddenInput'
  import { provideNumberFieldRootContext } from './context'
  import type { PrimitiveProps } from '../primitive'
  import { Primitive } from '../primitive'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(defineProps<NumberFieldRootProps>(), {
    as: 'div',
    defaultValue: undefined,
    step: 1,
    stepSnapping: true,
    focusOnChange: true,
  })
  const emits = defineEmits<NumberFieldRootEmits>()
  const { disabled, readonly, disableWheelChange, invertWheelChange, id } = toRefs(props)

  const modelValue = useVModel(props, 'modelValue', emits, {
    defaultValue: props.defaultValue,
    passive: props.modelValue === undefined,
  }) as Ref<number | undefined>

  const { primitiveElement, currentElement } = usePrimitiveElement()
  const config = injectConfigProviderContext(null)
  const locale = computed(() => resolveNumberFieldLocale(props.locale, config?.locale?.value))
  const isFormControl = computed(() =>
    currentElement.value ? Boolean(currentElement.value.closest('form')) : true,
  )
  const inputEl = ref<HTMLInputElement>()

  const format = computed(() => createNumberFieldFormat(locale.value, props.formatOptions))
  const range = computed<NumberFieldRange>(() => ({
    min: props.min,
    max: props.max,
    step: props.step,
    stepSnapping: props.stepSnapping,
  }))
  const isDecreaseDisabled = computed(() =>
    isNumberFieldAtLimit('decrease', modelValue.value, range.value, format.value),
  )
  const isIncreaseDisabled = computed(() =>
    isNumberFieldAtLimit('increase', modelValue.value, range.value, format.value),
  )
  const inputMode = computed(() => numberFieldInputMode(format.value))
  const textValue = computed(() => formatNumberFieldValue(modelValue.value, format.value))
  const attributes = computed(() =>
    numberFieldRootAttributes({ disabled: props.disabled, readonly: props.readonly }),
  )

  function step(direction: NumberFieldStep, multiplier = 1) {
    if (props.focusOnChange) inputEl.value?.focus()
    if (props.disabled || props.readonly) return
    modelValue.value = stepNumberFieldText(
      direction,
      inputEl.value?.value ?? '',
      range.value,
      format.value,
      multiplier,
    )
  }

  function jump(bound: NumberFieldBound) {
    const next = boundNumberFieldValue(bound, range.value, format.value)
    if (next !== undefined) modelValue.value = next
  }

  function commit(text: string) {
    const { value, reformat } = commitNumberFieldText(text, range.value, format.value)
    modelValue.value = value
    if (inputEl.value) inputEl.value.value = reformat ? textValue.value : text
  }

  const FormInput: FunctionalComponent = () =>
    isFormControl.value && props.name
      ? h(VisuallyHiddenInput, {
          type: 'text',
          value: modelValue.value,
          name: props.name,
          disabled: props.disabled,
          readonly: props.readonly,
          required: props.required,
        })
      : createCommentVNode('v-if', true)

  provideNumberFieldRootContext({
    modelValue,
    step,
    jump,
    commit,
    inputEl,
    onInputElement: element => (inputEl.value = element),
    inputMode,
    textValue,
    range,
    format,
    disabled,
    readonly,
    disableWheelChange,
    invertWheelChange,
    isDecreaseDisabled,
    isIncreaseDisabled,
    id,
  })
</script>

<template>
  <Primitive
    v-bind="{ ...$attrs, ...attributes }"
    ref="primitiveElement"
    :as="as"
    :as-child="asChild"
  >
    <slot :model-value="modelValue" :text-value="textValue" :readonly="readonly" />

    <FormInput />
  </Primitive>
</template>
