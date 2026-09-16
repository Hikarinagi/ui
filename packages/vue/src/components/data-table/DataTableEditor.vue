<script setup lang="ts" generic="T extends object">
  import { useId } from 'vue'
  import { Check, X } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import Input from '../input/Input.vue'
  import InputGroup from '../input-group/InputGroup.vue'
  import DataTableAction from './DataTableAction.vue'
  import Slot from './Slot'
  import type { DataTableEditorContext, DataTableSlots } from './types'
  defineProps<{ context: DataTableEditorContext<T>; slots: DataTableSlots<T>; cell: boolean }>()
  const t = useUiLocale()
  const errorId = useId()
</script>
<template>
  <div class="hn-table-editor" @click.stop @keydown.stop>
    <div class="hn-table-editor-control">
      <InputGroup
        variant="bare"
        size="sm"
        :disabled="context.pending"
        :invalid="!!context.error"
        class="hn-table-editor-field"
        role="group"
        :aria-label="`${t.table.edit}: ${context.column.label}`"
        :aria-describedby="context.error ? errorId : undefined"
      >
        <Slot :render="slots[`editor-${context.column.key}`] ?? slots.editor" :context="context">
          <Input
            :model-value="String(context.value ?? '')"
            :aria-label="`${t.table.edit}: ${context.column.label}`"
            :aria-describedby="context.error ? errorId : undefined"
            @update:model-value="context.updateValue"
            @keydown.enter.prevent="context.commit"
            @keydown.esc.prevent="context.cancel"
          />
        </Slot>
      </InputGroup>
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
    <p v-if="context.error" :id="errorId" role="alert" class="hn-table-field-error">
      {{ context.error }}
    </p>
  </div>
</template>
