<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import {
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxPortal,
  } from 'reka-ui'
  import { ref } from 'vue'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { selectEmpty, selectItem, selectLabel, selectListBody } from '../select/select.variants'
  import { isOptionGroup, type SelectItems, type SelectOption } from '../select/types'
  import { comboboxContent, comboboxList } from './combobox.variants'

  defineOptions({ name: 'HnComboboxList' })

  const props = defineProps<{ options: SelectItems; keyboard?: boolean }>()

  const fresh = ref(false)

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()

  const t = useUiLocale()
</script>

<template>
  <ComboboxPortal>
    <ComboboxContent as-child position="popper" align="start" :side-offset="8">
      <Card
        :padded="false"
        data-hn-combobox-content
        :data-hn-fresh="fresh && !props.keyboard ? '' : undefined"
        :class="comboboxContent()"
        @vue:mounted="fresh = true"
        @keydown="fresh = false"
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
</template>
