<script lang="ts">
  export interface ProgressRootProps extends PrimitiveProps {
    modelValue?: number | null
    max?: number
    getValueLabel?: (value: number | null | undefined, max: number) => string | undefined
    getValueText?: (value: number | null | undefined, max: number) => string | undefined
  }

  export type ProgressRootEmits = {
    'update:modelValue': [value: number | null | undefined]
    'update:max': [value: number]
  }
</script>

<script setup lang="ts">
  import { computed, nextTick, watch } from 'vue'
  import {
    DEFAULT_PROGRESS_MAX,
    defaultProgressLabel,
    isNumber,
    isValidProgressMax,
    isValidProgressValue,
    progressMaxError,
    progressState as getProgressState,
    progressValueError,
  } from '../../../../shared/src/primitives/progress'
  import { Primitive, type PrimitiveProps } from '../primitive'
  import { useForwardExpose } from '../utils/useForwardExpose'
  import { useVModel } from '../utils/useVModel'
  import { provideProgressRootContext } from './context'

  const props = withDefaults(defineProps<ProgressRootProps>(), {
    max: DEFAULT_PROGRESS_MAX,
    getValueLabel: defaultProgressLabel,
  })
  const emit = defineEmits<ProgressRootEmits>()
  useForwardExpose()

  const modelValue = useVModel(
    props,
    'modelValue',
    (_, value) => emit('update:modelValue', value),
    {
      passive: props.modelValue === undefined,
    },
  )
  const max = useVModel(props, 'max', (_, value) => emit('update:max', value), {
    passive: props.max === undefined,
  })

  watch(
    () => modelValue.value,
    async value => {
      const corrected = isValidProgressValue(value, props.max) ? value : null
      if (corrected === null && value != null) console.error(progressValueError(value))
      if (corrected !== value) {
        await nextTick()
        modelValue.value = corrected
      }
    },
    { immediate: true },
  )

  watch(
    () => props.max,
    value => {
      const corrected = isValidProgressMax(props.max) ? props.max : DEFAULT_PROGRESS_MAX
      if (corrected !== props.max) console.error(progressMaxError(props.max))
      if (corrected !== value) max.value = corrected
    },
    { immediate: true },
  )

  const progressState = computed(() => getProgressState(modelValue.value, max.value))

  provideProgressRootContext({ modelValue, max, progressState })
</script>

<template>
  <Primitive
    :as-child="asChild"
    :as="as"
    :aria-valuemax="max"
    :aria-valuemin="0"
    :aria-valuenow="isNumber(modelValue) ? modelValue : undefined"
    :aria-valuetext="getValueText?.(modelValue, max)"
    :aria-label="getValueLabel(modelValue, max)"
    role="progressbar"
    :data-state="progressState"
    :data-value="modelValue ?? undefined"
    :data-max="max"
  >
    <slot :modelValue="modelValue" />
  </Primitive>
</template>
