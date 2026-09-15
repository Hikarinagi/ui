<script setup lang="ts">
  import { expectTypeOf } from 'vitest'
  import { Anchor, type AnchorItem } from '../../src'

  interface Item extends AnchorItem {
    modified: boolean
    count: number
    children?: Item[]
  }
  const typed: Item[] = [
    {
      id: 'a',
      label: 'A',
      modified: true,
      count: 2,
      children: [{ id: 'b', label: 'B', modified: false, count: 1 }],
    },
  ]
  const flat = [{ id: 'flat', label: 'Flat', modified: true }]
  const nested = [
    {
      id: 'parent',
      label: 'Parent',
      modified: false,
      children: [{ id: 'child', label: 'Child', modified: true }],
    },
  ]
  const combined = [...flat, ...nested]
  const mixed = [
    {
      id: 'group',
      label: 'Group',
      kind: 'group' as const,
      children: [{ id: 'entry', label: 'Entry', kind: 'entry' as const, modified: true }],
    },
  ]
  const plain: AnchorItem[] = [{ id: 'plain', label: 'Plain' }]
</script>

<template>
  <Anchor :items="typed">
    <template #trailing="{ item, active }">
      {{ expectTypeOf(item).toEqualTypeOf(typed[0]!) }}
      {{ expectTypeOf(active).toEqualTypeOf(true as boolean) }}
      {{ item.count.toFixed() }}
      {{ expectTypeOf(item).not.toHaveProperty('missing') }}
    </template>
  </Anchor>
  <Anchor :items="flat">
    <template #trailing="{ item }">
      {{ expectTypeOf(item.modified).toEqualTypeOf(true as boolean) }}
    </template>
  </Anchor>
  <Anchor :items="nested">
    <template #trailing="{ item }">
      {{ expectTypeOf(item.modified).toEqualTypeOf(true as boolean) }}
    </template>
  </Anchor>
  <Anchor :items="combined">
    <template #trailing="{ item }">
      {{ expectTypeOf(item.modified).toEqualTypeOf(true as boolean) }}
    </template>
  </Anchor>
  <Anchor :items="mixed">
    <template #trailing="{ item }">
      <span v-if="item.kind === 'entry'">
        {{ expectTypeOf(item.modified).toEqualTypeOf(true as boolean) }}
      </span>
      <span v-else>{{ expectTypeOf(item.kind).toEqualTypeOf('group' as const) }}</span>
    </template>
  </Anchor>
  <Anchor :items="plain">
    <template #trailing="{ item }">{{ expectTypeOf(item).toEqualTypeOf(plain[0]!) }}</template>
  </Anchor>
</template>
