<script setup lang="ts">
  import { ListboxItem } from 'reka-ui'
  import { computed } from 'vue'
  import Kbd from '../kbd/Kbd.vue'
  import { selectItem } from '../select/select.variants'
  import { commandItemBody, commandItemHint, commandItemMatch } from './command-palette.variants'
  import type { CommandMatch } from './utils/match'

  defineOptions({ name: 'HnCommandPaletteItem' })

  const props = defineProps<{ match: CommandMatch }>()
  const emit = defineEmits<{ select: [] }>()

  const parts = computed(() => {
    const { item, start, end } = props.match
    if (start < 0) return [item.label, '', '']
    return [item.label.slice(0, start), item.label.slice(start, end), item.label.slice(end)]
  })
</script>

<template>
  <ListboxItem
    :value="props.match.item.id"
    :disabled="props.match.item.disabled"
    data-hn-highlight-only
    :class="selectItem()"
    @select="emit('select')"
  >
    <component
      :is="props.match.item.icon"
      v-if="props.match.item.icon"
      aria-hidden="true"
      class="text-muted"
    />
    <span :class="commandItemBody()">
      <span class="truncate">
        <span v-text="parts[0]" />
        <span v-if="parts[1]" :class="commandItemMatch()" v-text="parts[1]" />
        <span v-if="parts[2]" v-text="parts[2]" />
      </span>
      <span v-if="props.match.item.description" class="text-muted truncate text-xs">
        {{ props.match.item.description }}
      </span>
    </span>
    <span v-if="props.match.item.kbd?.length" :class="commandItemHint()">
      <Kbd v-for="key in props.match.item.kbd" :key="key">{{ key }}</Kbd>
    </span>
  </ListboxItem>
</template>
