<script setup lang="ts">
  import { computed, shallowRef, useSlots } from 'vue'
  import { DateRangeFieldInput, DateRangeFieldRoot, type DateRange } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import {
    formatDateRange,
    parseDateRange,
    parseDateValue,
    type DateGranularity,
    type DateRangeValue,
  } from '../../lib/date'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputActionSlot,
    inputAdornment,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import { useSegmentFocus } from '../date-field/composables/useSegmentFocus'
  import {
    dateFieldControl,
    dateFieldHost,
    dateFieldSegment,
  } from '../date-field/date-field.variants'
  import { dateRangeFieldSeparator } from './date-range-field.variants'
  import { isRangeInvalid } from './utils/validity'

  defineOptions({ name: 'HnDateRangeField', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      placeholder?: string
      min?: string
      max?: string
      granularity?: DateGranularity
      hourCycle?: 12 | 24
      clearable?: boolean
      readonly?: boolean
      name?: string
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { granularity: 'day', clearable: false },
  )
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<DateRangeValue | null>({ default: null })

  const slots = useSlots()
  const t = useUiLocale()
  const group = injectInputGroup()
  const host = shallowRef<HTMLElement | null>(null)

  const { labelledBy, invalid, disabled, describedBy } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value || outOfRange.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })

  const value = computed(() => parseDateRange(model.value, props.granularity))
  const placeholder = computed(() => parseDateValue(props.placeholder, props.granularity))
  const minValue = computed(() => parseDateValue(props.min, props.granularity))
  const maxValue = computed(() => parseDateValue(props.max, props.granularity))
  const outOfRange = computed(() =>
    isRangeInvalid(value.value, { min: minValue.value, max: maxValue.value }),
  )
  const clearing = computed(() => props.clearable && model.value != null && !disabled.value)

  const sides = ['start', 'end'] as const

  function segmentLabel(side: 'start' | 'end', part: string) {
    const name = (t.value.dateField as Record<string, string | undefined>)[part]
    return `${t.value.dateRangeField[side]} ${name}`
  }

  function update(next: DateRange) {
    model.value = formatDateRange(next, props.granularity)
  }

  const { focus, onHostClick } = useSegmentFocus(host)

  function clear() {
    if (model.value == null) return
    model.value = null
    emit('clear')
    focus()
  }

  defineExpose({ clear, focus })
</script>

<template>
  <div
    ref="host"
    data-hn-date-range-field
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="
      cn(
        group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
        dateFieldHost(),
        props.class,
      )
    "
    @click="onHostClick"
  >
    <span v-if="slots.leading" :class="inputAdornment()">
      <slot name="leading" />
    </span>
    <DateRangeFieldRoot
      v-slot="{ segments }"
      v-bind="$attrs"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :model-value="value"
      :placeholder="placeholder"
      :min-value="minValue"
      :max-value="maxValue"
      :granularity="props.granularity"
      :hour-cycle="props.hourCycle"
      :locale="t.tag"
      :disabled="disabled"
      :readonly="props.readonly"
      :name="props.name"
      :aria-invalid="invalid || undefined"
      :class="
        dateFieldControl({ leading: !!slots.leading, trailing: clearing || !!slots.trailing })
      "
      @update:model-value="update"
    >
      <template v-for="(side, index) in sides" :key="side">
        <span v-if="index" aria-hidden="true" :class="dateRangeFieldSeparator()">
          {{ t.dateRangeField.separator }}
        </span>
        <DateRangeFieldInput
          v-for="part in segments[side]"
          :key="`${side}-${part.part}`"
          :type="side"
          :part="part.part"
          data-hn-segment
          :aria-label="part.part === 'literal' ? undefined : segmentLabel(side, part.part)"
          :class="dateFieldSegment({ part: part.part === 'literal' ? 'literal' : 'editable' })"
        >
          {{ part.value }}
        </DateRangeFieldInput>
      </template>
    </DateRangeFieldRoot>
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-90 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-90 opacity-0"
    >
      <span v-if="clearing" :class="inputActionSlot()">
        <InputAction :label="t.common.clear" @click="clear">
          <X />
        </InputAction>
      </span>
    </Transition>
    <span v-if="slots.trailing" :class="inputAdornment()">
      <slot name="trailing" />
    </span>
  </div>
</template>
