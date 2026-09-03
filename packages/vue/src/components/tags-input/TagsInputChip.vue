<script setup lang="ts">
  import { TagsInputItemText } from 'reka-ui'
  import Chip from '../chip/Chip.vue'
  import type { ChipVariants } from '../chip/chip.variants'
  import { tagsInputChip } from './tags-input.variants'

  defineOptions({ name: 'HnTagsInputChip', inheritAttrs: false })

  const props = defineProps<{ tag: string; size: ChipVariants['size']; disabled?: boolean }>()

  const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <Chip
    v-bind="$attrs"
    :size="props.size"
    removable
    :disabled="props.disabled"
    :class="tagsInputChip()"
    :data-state="undefined"
    :aria-current="undefined"
    @remove="emit('remove')"
  >
    <TagsInputItemText as-child>
      <span class="min-w-0 truncate">{{ props.tag }}</span>
    </TagsInputItemText>
  </Chip>
</template>
