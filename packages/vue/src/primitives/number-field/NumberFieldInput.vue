<script lang="ts">
  export interface NumberFieldInputProps extends PrimitiveProps {}
</script>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import {
    deepActiveElement,
    numberFieldInputAttributes,
    numberFieldKeyAction,
    numberFieldWheelStep,
    rejectsNumberFieldInput,
  } from '../../../../shared/src/primitives/number-field'
  import { usePrimitiveElement } from '../utils/usePrimitiveElement'
  import { injectNumberFieldRootContext } from './context'
  import type { PrimitiveProps } from '../primitive'
  import { Primitive } from '../primitive'

  const props = withDefaults(defineProps<NumberFieldInputProps>(), { as: 'input' })

  const { primitiveElement, currentElement } = usePrimitiveElement()
  const root = injectNumberFieldRootContext()
  const composing = ref(false)

  function handleKeydown(event: KeyboardEvent) {
    const action = numberFieldKeyAction(event, composing.value)
    if (!action) return
    if (action.prevent) event.preventDefault()
    if (action.type === 'step') root.step(action.direction, action.multiplier)
    else if (action.type === 'bound') root.jump(action.bound)
    else root.commit((event.target as HTMLInputElement)?.value)
  }

  function handleWheel(event: WheelEvent) {
    const direction = numberFieldWheelStep(event, {
      focused: event.target === deepActiveElement(document),
      disabled: root.disableWheelChange.value,
      inverted: root.invertWheelChange.value,
    })
    if (!direction) return
    event.preventDefault()
    root.step(direction)
  }

  function handleBeforeInput(event: InputEvent) {
    const input = event.target as HTMLInputElement
    if (rejectsNumberFieldInput(event, input, root.range.value, root.format.value))
      event.preventDefault()
  }

  function handleInput(event: Event) {
    inputValue.value = (event.target as HTMLInputElement).value
  }

  function handleChange() {
    requestAnimationFrame(() => {
      inputValue.value = root.textValue.value
    })
  }

  function handleBlur(event: FocusEvent) {
    root.commit((event.target as HTMLInputElement)?.value)
  }

  function handleCompositionEnd() {
    void nextTick(() => {
      composing.value = false
    })
  }

  onMounted(() => {
    root.onInputElement(currentElement.value as HTMLInputElement)
  })

  const inputValue = ref(root.textValue.value)
  watch(
    () => root.textValue.value,
    () => {
      inputValue.value = root.textValue.value
    },
    { immediate: true, deep: true },
  )

  const attributes = computed(() =>
    numberFieldInputAttributes({
      id: root.id.value,
      value: inputValue.value,
      inputMode: root.inputMode.value,
      disabled: root.disabled.value,
      readonly: root.readonly.value,
      modelValue: root.modelValue.value,
      min: root.range.value.min,
      max: root.range.value.max,
    }),
  )
</script>

<template>
  <Primitive
    v-bind="{ ...props, ...attributes }"
    ref="primitiveElement"
    @keydown="handleKeydown"
    @wheel="handleWheel"
    @beforeinput="handleBeforeInput"
    @input="handleInput"
    @change="handleChange"
    @blur="handleBlur"
    @compositionstart="composing = true"
    @compositionend="handleCompositionEnd"
  >
    <slot />
  </Primitive>
</template>
