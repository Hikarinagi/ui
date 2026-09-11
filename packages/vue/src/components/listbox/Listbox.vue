<script setup lang="ts">
  import {
    ListboxContent,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxItem,
    ListboxRoot,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import { useUiLocale } from '../../locale'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectItem, selectLabel } from '../select/select.variants'
  import { isOptionGroup, type SelectItems, type SelectOption } from '../select/types'
  import ListboxOptionContent from './ListboxOptionContent.vue'
  import { listbox, listboxContent, type ListboxVariants } from './listbox.variants'

  defineOptions({ name: 'HnListbox', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      options: SelectItems
      multiple?: boolean
      maxHeight?: string
      padded?: boolean
      variant?: ListboxVariants['variant']
      disabled?: boolean
      class?: string
    }>(),
    { maxHeight: '20rem', padded: true },
  )

  const model = defineModel<string | number | null | Array<string | number>>()

  const slots = defineSlots<{
    option(props: { option: SelectOption; selected: boolean }): unknown
    trailing(props: { option: SelectOption; selected: boolean }): unknown
  }>()

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
      <ListboxContent v-bind="$attrs" :class="listboxContent({ padded: props.padded })">
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
              <ListboxOptionContent :option="option">
                <template v-if="slots.option" #option="slotProps">
                  <slot name="option" v-bind="slotProps" />
                </template>
                <template v-if="slots.trailing" #trailing="slotProps">
                  <slot name="trailing" v-bind="slotProps" />
                </template>
              </ListboxOptionContent>
            </ListboxItem>
          </ListboxGroup>
          <ListboxItem v-else :value="item.value" :disabled="item.disabled" :class="selectItem()">
            <ListboxOptionContent :option="item">
              <template v-if="slots.option" #option="slotProps">
                <slot name="option" v-bind="slotProps" />
              </template>
              <template v-if="slots.trailing" #trailing="slotProps">
                <slot name="trailing" v-bind="slotProps" />
              </template>
            </ListboxOptionContent>
          </ListboxItem>
        </template>
        <div v-if="props.options.length === 0" :class="selectEmpty()">{{ t.select.empty }}</div>
      </ListboxContent>
    </ScrollArea>
  </ListboxRoot>
</template>
