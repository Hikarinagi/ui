<script setup lang="ts" generic="T extends AutocompleteOption = AutocompleteOption">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { rekaPopoverStyle } from '../../lib/reka/styles'
  import { useUiLocale } from '../../locale'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputAdornment,
    inputControl,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import { selectEmpty, selectItem, selectListBody } from '../select/select.variants'
  import Popover from '../popover/Popover.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { autocompleteContent, autocompleteList } from './autocomplete.variants'
  import { useAutocomplete } from './composables/useAutocomplete'
  import type {
    AutocompleteOption,
    AutocompleteSelection,
    CompletionContext,
    CompletionEdit,
  } from './types'

  defineOptions({ name: 'HnAutocomplete', inheritAttrs: false })
  const props = defineProps<{
    options: readonly T[]
    getCompletion?: (option: T, context: CompletionContext) => CompletionEdit
    loading?: boolean
    selectOnTab?: boolean
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    invalid?: boolean
    size?: InputVariants['size']
    variant?: InputVariants['variant']
    class?: string
  }>()
  const model = defineModel<string>({ default: '' })
  const open = defineModel<boolean>('open', { default: false })
  const emit = defineEmits<{
    query: [context: CompletionContext]
    select: [selection: AutocompleteSelection<T>]
    submit: [text: string]
    clear: []
  }>()
  defineSlots<{
    leading?(): unknown
    trailing?(): unknown
    option?(props: { option: T; active: boolean }): unknown
    empty?(): unknown
    loading?(): unknown
  }>()
  const t = useUiLocale()
  const group = injectInputGroup()
  const size = computed(() => (group ? group.size.value : props.size))
  const { id, labelledBy, describedBy, invalid, disabled } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })
  const {
    input,
    host,
    scroll,
    listId,
    optionId,
    active,
    activeId,
    visible,
    composing,
    show,
    onInput,
    onBlur,
    onCompositionEnd,
    onKeydown,
    select,
    highlight,
  } = useAutocomplete({
    options: () => props.options,
    model,
    open,
    disabled: () => disabled.value,
    readonly: () => props.readonly,
    selectOnTab: () => props.selectOnTab,
    getCompletion: () => props.getCompletion,
    onQuery: value => emit('query', value),
    onSelect: value => emit('select', value),
    onSubmit: value => emit('submit', value),
    onClear: () => emit('clear'),
  })
  defineExpose({ input, focus: () => input.value?.focus(), blur: () => input.value?.blur() })
</script>

<template>
  <div
    ref="host"
    data-hn-autocomplete
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(group ? inputEmbedded() : inputHost({ size, variant: props.variant }), props.class)"
    @click="focusFieldFrom($event.currentTarget as HTMLElement, $event.target as HTMLElement)"
  >
    <span v-if="$slots.leading" :class="inputAdornment()"><slot name="leading" /></span>
    <input
      ref="input"
      v-bind="$attrs"
      :id="id"
      :value="model"
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      :aria-expanded="visible"
      :aria-controls="visible ? listId : undefined"
      :aria-activedescendant="activeId"
      :aria-busy="props.loading || undefined"
      :aria-invalid="invalid || undefined"
      :aria-labelledby="labelledBy"
      :aria-describedby="describedBy"
      :disabled="disabled"
      :readonly="props.readonly"
      :placeholder="props.placeholder"
      :class="
        inputControl({ leading: !!$slots.leading, trailing: !!$slots.trailing || props.loading })
      "
      @input="onInput"
      @focus="show"
      @click="show"
      @blur="onBlur"
      @keydown="onKeydown"
      @compositionstart="composing = true"
      @compositionend="onCompositionEnd"
    />
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-90 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-90 opacity-0"
    >
      <span v-if="props.loading" :class="inputAdornment()"><Spinner size="sm" /></span>
    </Transition>
    <span v-if="$slots.trailing" :class="inputAdornment()"><slot name="trailing" /></span>
  </div>
  <Popover
    v-model:open="visible"
    :anchor="host"
    :modal="false"
    :padded="false"
    align="start"
    role="presentation"
    :aria-hidden="!visible || undefined"
    :class="autocompleteContent()"
    :style="rekaPopoverStyle"
    @open-auto-focus.prevent
    @close-auto-focus.prevent
    @escape-key-down.prevent
  >
    <template #content>
      <ScrollArea ref="scroll" :class="autocompleteList()">
        <div
          :id="listId"
          role="listbox"
          :aria-label="
            ($attrs['aria-label'] as string | undefined) ??
            t.select.optionCountLabel(props.options.length)
          "
          :aria-labelledby="labelledBy"
          :aria-busy="props.loading || undefined"
          :class="selectListBody()"
        >
          <div
            v-for="(option, index) in props.options"
            :id="optionId(index)"
            :key="option.value"
            role="option"
            :aria-selected="active === option.value"
            :aria-disabled="option.disabled || undefined"
            :data-disabled="option.disabled ? '' : undefined"
            :data-highlighted="active === option.value ? '' : undefined"
            :class="selectItem()"
            @pointerdown.prevent
            @pointermove="highlight(option, $event)"
            @click="select(option)"
          >
            <slot name="option" :option="option" :active="active === option.value">
              <span class="min-w-0 flex-1">
                <span class="block truncate">{{ option.label }}</span>
                <span v-if="option.description" class="text-muted block truncate text-xs">
                  {{ option.description }}
                </span>
              </span>
            </slot>
          </div>
        </div>
        <div v-if="props.loading || !props.options.length" role="status" :class="selectEmpty()">
          <slot v-if="props.loading" name="loading">{{ t.common.loading }}</slot>
          <slot v-else name="empty">{{ t.select.empty }}</slot>
        </div>
      </ScrollArea>
    </template>
  </Popover>
</template>
