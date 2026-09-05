<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { SelectRoot, SelectTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Chip from '../chip/Chip.vue'
  import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'
  import { X } from '@lucide/vue'
  import InputAction from '../input/InputAction.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputActionSlot,
    inputAdornment,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import SelectList from '../select/SelectList.vue'
  import { flattenOptions, type SelectItems, type SelectOption } from '../select/types'
  import { multiSelectChips, multiSelectTrigger } from './multi-select.variants'

  defineOptions({ name: 'HnMultiSelect', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      options: SelectItems
      placeholder?: string
      name?: string
      required?: boolean
      autocomplete?: string
      maxVisible?: number
      clearable?: boolean
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { maxVisible: 2, clearable: false },
  )
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<Array<string | number>>({ default: () => [] })
  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()

  const t = useUiLocale()
  const group = injectInputGroup()
  const keyboard = ref(false)

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
  const selected = computed(() =>
    flattenOptions(props.options).filter(option => model.value.includes(option.value)),
  )
  const formOptions = computed(() => flattenOptions(props.options))
  const visible = computed(() => selected.value.slice(0, props.maxVisible))
  const overflow = computed(() => selected.value.length - visible.value.length)
  const chipSize = computed(() => (size.value === 'sm' ? 'sm' : 'md'))
  const clearing = computed(() => props.clearable && selected.value.length > 0 && !disabled.value)

  function remove(value: string | number) {
    if (disabled.value) return
    model.value = model.value.filter(item => item !== value)
  }

  function clear() {
    if (!model.value.length) return
    model.value = []
    emit('clear')
  }

  function isolate(event: Event) {
    if ((event.target as HTMLElement).closest('button')) event.stopPropagation()
  }
</script>

<template>
  <SelectRoot
    v-model="model"
    v-model:open="open"
    :disabled="disabled"
    :required="props.required"
    multiple
  >
    <SelectTrigger
      v-bind="$attrs"
      as="div"
      :id="fieldId"
      :aria-describedby="describedBy"
      data-hn-multi-select
      @keydown="keyboard = true"
      @pointerdown="keyboard = false"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      :data-invalid="invalid ? '' : undefined"
      :aria-invalid="invalid || undefined"
      :class="
        cn(
          group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
          multiSelectTrigger(),
          props.class,
        )
      "
    >
      <span :class="multiSelectChips()">
        <template v-if="selected.length">
          <Chip
            v-for="option in visible"
            :key="option.value"
            :size="chipSize"
            removable
            :disabled="disabled"
            class="max-w-40 min-w-0 shrink data-disabled:opacity-100"
            @pointerdown="isolate"
            @click="isolate"
            @remove="remove(option.value)"
          >
            <span class="min-w-0 truncate">{{ option.label }}</span>
          </Chip>
          <Chip
            v-if="overflow > 0"
            :size="chipSize"
            :disabled="disabled"
            class="shrink-0 data-disabled:opacity-100"
          >
            +{{ overflow }}
          </Chip>
        </template>
        <span v-else class="min-w-0 truncate">{{ props.placeholder ?? t.select.placeholder }}</span>
      </span>
      <Transition
        enter-active-class="hn-transition-base"
        enter-from-class="scale-90 opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="scale-90 opacity-0"
      >
        <span v-if="clearing" data-hn-multi-select-clear :class="inputActionSlot()">
          <InputAction :label="t.common.clear" @pointerdown.stop @click.stop="clear">
            <X />
          </InputAction>
        </span>
      </Transition>
      <span :class="inputAdornment()">
        <DisclosureIcon />
      </span>
    </SelectTrigger>
    <!-- Reka 2.10 BubbleSelect assigns arrays to select.value, which loses multiple values. -->
    <VisuallyHidden v-if="props.name" as-child>
      <select
        v-model="model"
        multiple
        :name="props.name"
        :required="props.required"
        :autocomplete="props.autocomplete"
        :disabled="disabled"
        aria-hidden="true"
        tabindex="-1"
      >
        <option
          v-for="option in formOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
    </VisuallyHidden>
    <SelectList :options="props.options" :keyboard="keyboard">
      <template #option="slotProps">
        <slot name="option" v-bind="slotProps" />
      </template>
    </SelectList>
  </SelectRoot>
</template>
