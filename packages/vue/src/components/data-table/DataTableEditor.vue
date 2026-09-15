<script setup lang="ts" generic="T extends object">
  import { Check, X } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import Input from '../input/Input.vue'
  import Button from '../button/Button.vue'
  import Slot from './Slot'
  import type { DataTableEditorContext, DataTableSlots } from './types'
  defineProps<{ context: DataTableEditorContext<T>; slots: DataTableSlots<T>; cell: boolean }>()
  const t = useUiLocale()
</script>
<template>
  <div class="min-w-0 py-1" @click.stop @keydown.stop>
    <div class="flex items-center gap-1">
      <div class="min-w-0 flex-1">
        <Slot :render="slots[`editor-${context.column.key}`] ?? slots.editor" :context="context">
          <Input
            :model-value="String(context.value ?? '')"
            :aria-label="`${t.table.edit}: ${context.column.label}`"
            :invalid="!!context.error"
            :disabled="context.pending"
            size="sm"
            @update:model-value="context.updateValue"
            @keydown.enter.prevent="context.commit"
            @keydown.esc.prevent="context.cancel"
          />
        </Slot>
      </div>
      <template v-if="cell">
        <Button
          size="sm"
          variant="ghost"
          icon-only
          :loading="context.pending"
          :aria-label="t.table.save"
          @click="context.commit"
        >
          <Check />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon-only
          :disabled="context.pending"
          :aria-label="t.table.cancel"
          @click="context.cancel"
        >
          <X />
        </Button>
      </template>
    </div>
    <p v-if="context.error" role="alert" class="text-danger mt-1 text-xs">{{ context.error }}</p>
  </div>
</template>
