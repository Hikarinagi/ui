<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Input from '../input/Input.vue'
  import { usePaginationJump } from './composables/usePaginationJump'
  defineOptions({ name: 'HnPaginationJump' })
  const props = defineProps<{ class?: string }>()
  const t = useUiLocale()
  const { draft, commit, reset, size, blocked } = usePaginationJump()
</script>

<template>
  <label
    data-hn-pagination-jump
    :class="
      cn('text-muted flex shrink-0 items-center gap-2 text-sm whitespace-nowrap', props.class)
    "
  >
    {{ t.pagination.jumpLabel }}
    <Input
      v-model="draft"
      :size="size"
      :disabled="blocked"
      inputmode="numeric"
      :aria-label="t.pagination.jumpLabel"
      class="w-16"
      @blur="commit"
      @keydown.enter.prevent.stop="commit"
      @keydown.esc.prevent.stop="reset"
    />
  </label>
</template>
