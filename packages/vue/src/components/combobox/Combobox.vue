<script setup lang="ts">
  import { computed, ref, shallowRef, watch } from 'vue'
  import { Check } from '@lucide/vue'
  import {
    ComboboxAnchor,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxPortal,
    ComboboxRoot,
    ComboboxTrigger,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { focusFieldFrom } from '../../lib/field-focus'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputControl,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectItem, selectLabel, selectListBody } from '../select/select.variants'
  import {
    flattenOptions,
    isOptionGroup,
    type SelectItems,
    type SelectOption,
  } from '../select/types'
  import { comboboxContent, comboboxList, comboboxToggle } from './combobox.variants'

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
  const fresh = ref(false)
  const input = shallowRef<{ $el: HTMLInputElement } | null>(null)

  const size = computed(() => (group ? group.size.value : props.size))
  const disabled = computed(() => props.disabled || !!group?.disabled.value)
  const invalid = computed(() => props.invalid || !!group?.invalid.value)
  const closeSize = computed(() => (size.value === 'sm' ? 'xs' : size.value === 'lg' ? 'md' : 'sm'))
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
        @keydown="fresh = false"
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
          <span v-if="clearing" data-hn-combobox-clear class="flex shrink-0 items-center ps-2">
            <CloseButton
              :label="t.common.clear"
              :size="closeSize"
              @mousedown.prevent
              @click="clear"
            />
          </span>
        </Transition>
        <ComboboxTrigger
          :aria-label="t.combobox.toggle"
          :disabled="disabled"
          :class="comboboxToggle()"
          @mousedown.prevent
        >
          <DisclosureIcon :open="open" class="[&>svg]:size-[var(--hn-input-icon)]" />
        </ComboboxTrigger>
      </div>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent as-child position="popper" align="start" :side-offset="8">
        <Card
          :padded="false"
          data-hn-combobox-content
          :data-hn-fresh="fresh ? '' : undefined"
          :class="comboboxContent()"
          @vue:mounted="fresh = true"
          @pointermove="fresh = false"
        >
          <ScrollArea :class="comboboxList()">
            <div :class="selectListBody()">
              <template
                v-for="item in props.options"
                :key="isOptionGroup(item) ? item.label : item.value"
              >
                <ComboboxGroup v-if="isOptionGroup(item)">
                  <ComboboxLabel :class="selectLabel()">{{ item.label }}</ComboboxLabel>
                  <ComboboxItem
                    v-for="option in item.options"
                    :key="option.value"
                    :value="option.value"
                    :text-value="option.label"
                    :disabled="option.disabled"
                    :class="selectItem()"
                  >
                    <span class="min-w-0 flex-1">
                      <slot name="option" :option="option">
                        <span class="block truncate">{{ option.label }}</span>
                        <span v-if="option.description" class="text-muted block truncate text-xs">
                          {{ option.description }}
                        </span>
                      </slot>
                    </span>
                    <span class="flex size-4 shrink-0 items-center justify-center">
                      <ComboboxItemIndicator><Check /></ComboboxItemIndicator>
                    </span>
                  </ComboboxItem>
                </ComboboxGroup>
                <ComboboxItem
                  v-else
                  :value="item.value"
                  :text-value="item.label"
                  :disabled="item.disabled"
                  :class="selectItem()"
                >
                  <span class="min-w-0 flex-1">
                    <slot name="option" :option="item">
                      <span class="block truncate">{{ item.label }}</span>
                      <span v-if="item.description" class="text-muted block truncate text-xs">
                        {{ item.description }}
                      </span>
                    </slot>
                  </span>
                  <span class="flex size-4 shrink-0 items-center justify-center">
                    <ComboboxItemIndicator><Check /></ComboboxItemIndicator>
                  </span>
                </ComboboxItem>
              </template>
              <ComboboxEmpty :class="selectEmpty()">{{ t.select.empty }}</ComboboxEmpty>
            </div>
          </ScrollArea>
        </Card>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
