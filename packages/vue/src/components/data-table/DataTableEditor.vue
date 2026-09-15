<script setup lang="ts" generic="T extends object">
  import { Check, X } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import Input from '../input/Input.vue'
  import DataTableAction from './DataTableAction.vue'
  import Slot from './Slot'
  import type { DataTableEditorContext, DataTableSlots } from './types'
  defineProps<{ context: DataTableEditorContext<T>; slots: DataTableSlots<T>; cell: boolean }>()
  const t = useUiLocale()
</script>
<template>
  <div class="hn-table-editor" @click.stop @keydown.stop>
    <div class="flex items-center gap-1">
      <div class="min-w-0 flex-1">
        <Slot :render="slots[`editor-${context.column.key}`] ?? slots.editor" :context="context">
          <Input
            :model-value="String(context.value ?? '')"
            :aria-label="`${t.table.edit}: ${context.column.label}`"
            :invalid="!!context.error"
            :disabled="context.pending"
            size="sm"
            variant="bare"
            class="[--hn-input-px:0px] font-normal"
            @update:model-value="context.updateValue"
            @keydown.enter.prevent="context.commit"
            @keydown.esc.prevent="context.cancel"
          />
        </Slot>
      </div>
      <template v-if="cell">
        <DataTableAction
          :loading="context.pending"
          :aria-label="t.table.save"
          @click="context.commit"
        >
          <Check />
        </DataTableAction>
        <DataTableAction
          :disabled="context.pending"
          :aria-label="t.table.cancel"
          @click="context.cancel"
        >
          <X />
        </DataTableAction>
      </template>
    </div>
    <p v-if="context.error" role="alert" class="text-danger mt-1 text-xs">{{ context.error }}</p>
  </div>
</template>
