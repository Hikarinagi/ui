<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import {
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectLabel,
    SelectPortal,
  } from 'reka-ui'
  import { useUiLocale } from '../../locale'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import {
    selectContent,
    selectEmpty,
    selectItem,
    selectLabel,
    selectList,
  } from './select.variants'
  import { isOptionGroup, type SelectItems, type SelectOption } from './types'

  defineOptions({ name: 'HnSelectList' })

  const props = defineProps<{ options: SelectItems }>()

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()

  const t = useUiLocale()
</script>

<template>
  <SelectPortal>
    <SelectContent as-child position="popper" align="start" :side-offset="8">
      <Card :padded="false" data-hn-select-content :class="selectContent()">
        <ScrollArea :class="selectList()">
          <template
            v-for="item in props.options"
            :key="isOptionGroup(item) ? item.label : item.value"
          >
            <SelectGroup v-if="isOptionGroup(item)">
              <SelectLabel :class="selectLabel()">{{ item.label }}</SelectLabel>
              <SelectItem
                v-for="option in item.options"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
                :text-value="option.label"
                :class="selectItem()"
              >
                <SelectItemText as-child>
                  <span class="min-w-0 flex-1">
                    <slot name="option" :option="option">
                      <span class="block truncate">{{ option.label }}</span>
                      <span v-if="option.description" class="text-muted block truncate text-xs">
                        {{ option.description }}
                      </span>
                    </slot>
                  </span>
                </SelectItemText>
                <span class="flex size-4 shrink-0 items-center justify-center">
                  <SelectItemIndicator><Check /></SelectItemIndicator>
                </span>
              </SelectItem>
            </SelectGroup>
            <SelectItem
              v-else
              :value="item.value"
              :disabled="item.disabled"
              :text-value="item.label"
              :class="selectItem()"
            >
              <SelectItemText as-child>
                <span class="min-w-0 flex-1">
                  <slot name="option" :option="item">
                    <span class="block truncate">{{ item.label }}</span>
                    <span v-if="item.description" class="text-muted block truncate text-xs">
                      {{ item.description }}
                    </span>
                  </slot>
                </span>
              </SelectItemText>
              <span class="flex size-4 shrink-0 items-center justify-center">
                <SelectItemIndicator><Check /></SelectItemIndicator>
              </span>
            </SelectItem>
          </template>
          <div v-if="props.options.length === 0" :class="selectEmpty()">{{ t.select.empty }}</div>
        </ScrollArea>
      </Card>
    </SelectContent>
  </SelectPortal>
</template>
