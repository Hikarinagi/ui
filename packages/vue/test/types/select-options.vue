<script setup lang="ts">
  import { expectTypeOf } from 'vitest'
  import {
    Select,
    MultiSelect,
    Combobox,
    MultiCombobox,
    Listbox,
    CheckboxGroup,
    RadioGroup,
    SegmentedControl,
    type SelectOption,
    type SelectOptionGroup,
    type SelectItems,
  } from '../../src'

  type Option = SelectOption<{ count: number; avatar: string; options: { nested: boolean } }>
  const flat: Option[] = [
    { value: 0, label: 'Zero', count: 12, avatar: '/zero.png', options: { nested: true } },
    { value: 'one', label: 'One', count: 24, avatar: '/one.png', options: { nested: false } },
  ]
  const group: SelectOptionGroup<Option> = { label: 'Group', options: flat }
  const mixed: SelectItems<Option> = [flat[0]!, group]
  const groups = [group]
  const empty: SelectItems<Option> = []
</script>

<template>
  <Select :options="mixed">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
    <template #value="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </Select>
  <MultiSelect :options="mixed">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </MultiSelect>
  <Combobox :options="mixed">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </Combobox>
  <MultiCombobox :options="mixed">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </MultiCombobox>
  <Listbox :options="mixed">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
    <template #trailing="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </Listbox>
  <CheckboxGroup :options="flat">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </CheckboxGroup>
  <RadioGroup :options="flat">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </RadioGroup>
  <SegmentedControl :options="flat">
    <template #option="{ option }">
      {{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}
      {{ option.count.toFixed() }} {{ option.avatar.toUpperCase() }}
      {{ expectTypeOf(option).not.toHaveProperty('missing') }}
    </template>
  </SegmentedControl>
  <Select :options="groups">
    <template #option="{ option }">{{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}</template>
  </Select>
  <Select :options="empty">
    <template #value="{ option }">{{ expectTypeOf(option).toEqualTypeOf(flat[0]!) }}</template>
  </Select>
  <Select :options="[{ value: 'plain', label: 'Plain' }]" />
</template>
