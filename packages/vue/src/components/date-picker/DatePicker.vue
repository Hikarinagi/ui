<script setup lang="ts">
  import { computed, shallowRef, useSlots } from 'vue'
  import {
    PopoverAnchor,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
  } from 'reka-ui'
  import { CalendarDays } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Calendar from '../calendar/Calendar.vue'
  import type { CalendarVariants } from '../calendar/calendar.variants'
  import Card from '../card/Card.vue'
  import DateField from '../date-field/DateField.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import InputGroupScope from '../input-group/InputGroupScope.vue'
  import InputAction from '../input/InputAction.vue'
  import { inputEmbedded, inputHost, type InputVariants } from '../input/input.variants'
  import { datePickerContent } from './date-picker.variants'

  defineOptions({ name: 'HnDatePicker', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      placeholder?: string
      min?: string
      max?: string
      unavailable?: (date: string) => boolean
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
      weekdayFormat?: 'narrow' | 'short'
      fixedWeeks?: boolean
      clearable?: boolean
      readonly?: boolean
      name?: string
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { clearable: false, fixedWeeks: true },
  )
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<string | null>({ default: null })
  const open = defineModel<boolean>('open', { default: false })

  const slots = useSlots()
  const t = useUiLocale()
  const outer = injectInputGroup()
  const host = shallowRef<HTMLElement | null>(null)

  const size = computed(() => (outer ? outer.size.value : props.size))
  const { invalid, disabled } = useFieldControl({
    invalid: () => props.invalid || !!outer?.invalid.value,
    disabled: () => props.disabled || !!outer?.disabled.value,
  })
  const calendarSize = computed<CalendarVariants['size']>(() => size.value ?? 'md')

  function pick(next: string | null) {
    model.value = next
    if (next) open.value = false
  }
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <PopoverAnchor as-child>
      <div
        ref="host"
        data-hn-date-picker
        :data-invalid="invalid ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :class="
          cn(
            outer ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
            props.class,
          )
        "
      >
        <InputGroupScope :size="size" :disabled="disabled" :invalid="invalid">
          <DateField
            v-bind="$attrs"
            :model-value="model"
            :placeholder="props.placeholder"
            :min="props.min"
            :max="props.max"
            :clearable="props.clearable"
            :readonly="props.readonly"
            :name="props.name"
            @update:model-value="model = $event"
            @clear="emit('clear')"
          >
            <template v-if="slots.leading" #leading>
              <slot name="leading" />
            </template>
          </DateField>
        </InputGroupScope>
        <PopoverTrigger as-child>
          <InputAction :label="t.datePicker.open" :disabled="disabled">
            <CalendarDays />
          </InputAction>
        </PopoverTrigger>
      </div>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        as-child
        side="bottom"
        align="start"
        :side-offset="8"
        @open-auto-focus.prevent
      >
        <Card :padded="false" :class="datePickerContent()">
          <Calendar
            :model-value="model"
            :placeholder="props.placeholder"
            :min="props.min"
            :max="props.max"
            :unavailable="props.unavailable"
            :week-starts-on="props.weekStartsOn"
            :weekday-format="props.weekdayFormat"
            :fixed-weeks="props.fixedWeeks"
            :size="calendarSize"
            :readonly="props.readonly"
            autofocus
            @update:model-value="pick"
          />
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
