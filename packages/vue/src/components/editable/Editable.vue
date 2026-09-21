<script setup lang="ts">
  import { computed, shallowRef, useId } from 'vue'
  import { Check, Pencil, X } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useFieldControl } from '../form-field/context'
  import IconButton from '../icon-button/IconButton.vue'
  import Textarea from '../textarea/Textarea.vue'
  import { useEditable } from './composables/useEditable'
  import {
    editable,
    editablePreview,
    editablePreviewText,
    editableInput,
    editableActions,
    editableError,
  } from './editable.variants'
  import type { EditableProps, EditableControls } from './types'

  defineOptions({ name: 'HnEditable', inheritAttrs: false })
  const props = withDefaults(defineProps<EditableProps>(), {
    activationMode: 'click',
    submitMode: 'both',
    selectOnFocus: true,
    controls: true,
    rows: 3,
  })
  const model = defineModel<string>({ default: '' })
  const editing = defineModel<boolean>('editing', { default: false })
  const emit = defineEmits<{
    edit: []
    submit: [value: string, previousValue: string]
    cancel: [draft: string]
    error: [error: unknown]
  }>()
  defineSlots<{
    preview?(props: { value: string; empty: boolean }): unknown
    actions?(props: EditableControls): unknown
  }>()
  const t = useUiLocale()
  const { id, labelledBy, describedBy, invalid, disabled } = useFieldControl({
    disabled: () => props.disabled,
    invalid: () => props.invalid,
  })
  const errorId = `hn-editable-error-${useId()}`
  const editor = shallowRef<HTMLInputElement | InstanceType<typeof Textarea>>()
  const nativeInput = computed(() => {
    const instance = editor.value
    return instance && 'input' in instance ? (instance.input ?? undefined) : instance
  })
  const {
    root,
    input,
    preview,
    draft,
    error,
    saving,
    blocked,
    dirty,
    edit,
    submit,
    cancel,
    focus,
    onInput,
    onFocusout,
    onKeydown,
    onCompositionStart,
    onCompositionEnd,
  } = useEditable({
    props,
    model,
    editing,
    input: nativeInput,
    disabled: () => disabled.value,
    failureMessage: () => t.value.editable.failed,
    requiredMessage: () => t.value.form.required,
    onEdit: () => emit('edit'),
    onSubmit: (value, previous) => emit('submit', value, previous),
    onCancel: value => emit('cancel', value),
    onError: error => emit('error', error),
  })
  const description = computed(
    () =>
      [describedBy.value, error.value ? errorId : undefined].filter(Boolean).join(' ') || undefined,
  )
  const editorProps = computed(() =>
    props.multiline
      ? {
          modelValue: draft.value,
          rows: props.rows,
          size: props.size,
          invalid: invalid.value || !!error.value,
        }
      : { value: draft.value, type: 'text' },
  )
  const interactive = computed(() => !props.readonly && props.activationMode !== 'manual')
  const isEditing = computed(() => editing.value && !blocked.value)
  const scope = computed<EditableControls>(() => ({
    editing: isEditing.value,
    draft: draft.value,
    dirty: dirty.value,
    saving: saving.value,
    disabled: blocked.value,
    error: error.value,
    edit,
    submit: () => submit(),
    cancel,
  }))
  function activate(event: KeyboardEvent) {
    if (!interactive.value || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    edit()
  }
  defineExpose({ edit, submit: () => submit(), cancel, focus, input, draft, saving, error })
</script>

<template>
  <div
    ref="root"
    data-hn-editable
    :data-state="isEditing ? 'editing' : 'preview'"
    :data-saving="saving ? '' : undefined"
    :aria-busy="saving || undefined"
    :class="cn(editable({ size: props.size }), props.class)"
    @focusout="onFocusout"
    @keydown="onKeydown"
  >
    <component
      v-if="!isEditing"
      :is="interactive ? 'button' : 'div'"
      ref="preview"
      v-bind="$attrs"
      :id="id"
      :type="interactive ? 'button' : undefined"
      :disabled="interactive ? disabled : undefined"
      :tabindex="!interactive && props.activationMode === 'manual' && !blocked ? 0 : undefined"
      :aria-label="
        ($attrs['aria-label'] as string | undefined) || (labelledBy ? undefined : t.editable.edit)
      "
      :aria-labelledby="labelledBy"
      :aria-describedby="description"
      :aria-invalid="invalid || undefined"
      :data-disabled="disabled ? '' : undefined"
      :data-invalid="invalid ? '' : undefined"
      :class="editablePreview({ interactive })"
      @click="props.activationMode === 'click' && edit()"
      @dblclick="props.activationMode === 'dblclick' && edit()"
      @keydown="activate"
    >
      <span
        :class="editablePreviewText({ multiline: props.multiline })"
        :data-empty="!model ? '' : undefined"
      >
        <slot name="preview" :value="model" :empty="!model">
          {{ model || props.placeholder || t.editable.placeholder }}
        </slot>
      </span>
      <Pencil
        v-if="interactive && !disabled"
        aria-hidden="true"
        class="size-3.5 shrink-0 text-muted"
      />
    </component>
    <component
      v-else
      :is="props.multiline ? Textarea : 'input'"
      ref="editor"
      v-bind="{ ...$attrs, ...editorProps }"
      :id="id"
      :required="props.required"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder ?? t.editable.placeholder"
      :readonly="saving"
      :disabled="disabled"
      :aria-label="
        ($attrs['aria-label'] as string | undefined) || (labelledBy ? undefined : t.editable.edit)
      "
      :aria-labelledby="labelledBy"
      :aria-describedby="description"
      :aria-invalid="invalid || !!error || undefined"
      :data-invalid="invalid || error ? '' : undefined"
      :class="props.multiline ? 'font-normal' : editableInput()"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
    <input v-if="props.name" type="hidden" :name="props.name" :value="model" :disabled="disabled" />
    <div v-if="error" :id="errorId" role="alert" :class="editableError()">{{ error }}</div>
    <div
      v-if="
        $slots.actions ||
        (props.controls && (isEditing || props.activationMode === 'manual') && !props.readonly)
      "
      :class="editableActions()"
    >
      <slot name="actions" v-bind="scope">
        <template v-if="isEditing">
          <IconButton
            :label="t.editable.save"
            :size="props.size"
            variant="soft"
            tone="accent"
            :loading="saving"
            :disabled="disabled"
            :ripple="false"
            @click="submit()"
          >
            <Check />
          </IconButton>
          <IconButton
            :label="t.common.cancel"
            :size="props.size"
            :disabled="saving || disabled"
            :ripple="false"
            @click="cancel"
          >
            <X />
          </IconButton>
        </template>
        <IconButton
          v-else
          :label="t.editable.edit"
          :size="props.size"
          :disabled="disabled"
          :ripple="false"
          @click="edit"
        >
          <Pencil />
        </IconButton>
      </slot>
    </div>
  </div>
</template>
