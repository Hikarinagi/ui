<script setup lang="ts">
  import { computed, shallowRef, useSlots } from 'vue'
  import { DateFieldInput, DateFieldRoot } from 'reka-ui'
  import type { DateValue } from '@internationalized/date'
  import { cn } from '../../lib/cn'
  import { formatDateValue, parseDateValue, type DateGranularity } from '../../lib/date'
  import { useUiLocale } from '../../locale'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputActionSlot,
    inputAdornment,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import { useSegmentFocus } from './composables/useSegmentFocus'
  import { dateFieldControl, dateFieldHost, dateFieldSegment } from './date-field.variants'

  defineOptions({ name: 'HnDateField', inheritAttrs: false })

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

  const model = defineModel<string | null>({ default: null })

  const slots = useSlots()
  const t = useUiLocale()
  const group = injectInputGroup()
  const host = shallowRef<HTMLElement | null>(null)

  const size = computed(() => (group ? group.size.value : props.size))
  const disabled = computed(() => props.disabled || !!group?.disabled.value)

  const value = computed(() => parseDateValue(model.value, props.granularity))
  const placeholder = computed(() => parseDateValue(props.placeholder, props.granularity))
  const minValue = computed(() => parseDateValue(props.min, props.granularity))
  const maxValue = computed(() => parseDateValue(props.max, props.granularity))
  const outOfRange = computed(
    () =>
      !!value.value &&
      ((!!minValue.value && value.value.compare(minValue.value) < 0) ||
        (!!maxValue.value && value.value.compare(maxValue.value) > 0)),
  )
  const invalid = computed(() => props.invalid || !!group?.invalid.value || outOfRange.value)
  const clearing = computed(() => props.clearable && model.value != null && !disabled.value)

  function segmentLabel(part: string) {
    return (t.value.dateField as Record<string, string | undefined>)[part]
  }

  function update(next: DateValue | undefined) {
    model.value = next ? formatDateValue(next, props.granularity) : null
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
    data-hn-date-field
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
    <DateFieldRoot
      v-slot="{ segments: parts }"
      v-bind="$attrs"
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
      <DateFieldInput
        v-for="part in parts"
        :key="part.part"
        :part="part.part"
        data-hn-segment
        :aria-label="part.part === 'literal' ? undefined : segmentLabel(part.part)"
        :class="dateFieldSegment({ part: part.part === 'literal' ? 'literal' : 'editable' })"
      >
        {{ part.value }}
      </DateFieldInput>
    </DateFieldRoot>
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
