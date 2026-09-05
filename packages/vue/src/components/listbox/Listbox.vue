<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import {
    ListboxContent,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxItem,
    ListboxItemIndicator,
    ListboxRoot,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectItem, selectLabel } from '../select/select.variants'
  import { isOptionGroup, type SelectItems, type SelectOption } from '../select/types'
  import { listbox, listboxContent, type ListboxVariants } from './listbox.variants'

  defineOptions({ name: 'HnListbox', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      options: SelectItems
      multiple?: boolean
      maxHeight?: string
      variant?: ListboxVariants['variant']
      disabled?: boolean
      class?: string
    }>(),
    { maxHeight: '20rem' },
  )

  const model = defineModel<string | number | null | Array<string | number>>()

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()

  const t = useUiLocale()

  const { labelledBy, invalid, disabled, describedBy } = useFieldControl({
    disabled: () => props.disabled,
  })
</script>

<template>
  <ListboxRoot
    v-model="model"
    :multiple="props.multiple"
    :disabled="disabled"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :aria-invalid="invalid || undefined"
    data-hn-listbox
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? '' : undefined"
    :class="cn(listbox({ variant: props.variant }), props.class)"
  >
    <ScrollArea :style="{ maxHeight: props.maxHeight }">
      <ListboxContent v-bind="$attrs" :class="listboxContent()">
        <template
          v-for="item in props.options"
          :key="isOptionGroup(item) ? item.label : item.value"
        >
          <ListboxGroup v-if="isOptionGroup(item)">
            <ListboxGroupLabel :class="selectLabel()">{{ item.label }}</ListboxGroupLabel>
            <ListboxItem
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
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
                <ListboxItemIndicator><Check /></ListboxItemIndicator>
              </span>
            </ListboxItem>
          </ListboxGroup>
          <ListboxItem v-else :value="item.value" :disabled="item.disabled" :class="selectItem()">
            <span class="min-w-0 flex-1">
              <slot name="option" :option="item">
                <span class="block truncate">{{ item.label }}</span>
                <span v-if="item.description" class="text-muted block truncate text-xs">
                  {{ item.description }}
                </span>
              </slot>
            </span>
            <span class="flex size-4 shrink-0 items-center justify-center">
              <ListboxItemIndicator><Check /></ListboxItemIndicator>
            </span>
          </ListboxItem>
        </template>
        <div v-if="props.options.length === 0" :class="selectEmpty()">{{ t.select.empty }}</div>
      </ListboxContent>
    </ScrollArea>
  </ListboxRoot>
</template>
