'use client'

import {
  useId,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type CompositionEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { useControllableState } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { useFieldControl } from '../form-field/context'
import { IconButton } from '../icon-button/IconButton'
import { Textarea, type TextareaHandle } from '../textarea/Textarea'
import { useEditable } from './hooks/useEditable'
import {
  editable,
  editableActions,
  editableError,
  editableInput,
  editablePreview,
  editablePreviewText,
} from './editable.variants'
import type { EditableControls, EditableProps } from './types'

const CheckIcon = lucide(Check)
const PencilIcon = lucide(Pencil)
const XIcon = lucide(X)

const plain = { ripple: false } as object

export function Editable({
  activationMode = 'click',
  submitMode = 'both',
  selectOnFocus = true,
  multiline = false,
  rows = 3,
  controls = true,
  placeholder,
  name,
  required,
  maxlength,
  disabled: disabledProp,
  readonly = false,
  invalid: invalidProp,
  size,
  onSave,
  value,
  defaultValue = '',
  onValueChange,
  editing: editingProp,
  defaultEditing = false,
  onEditingChange,
  onEdit,
  onSubmit,
  onCancel,
  onError,
  renderPreview,
  renderActions,
  className,
  ref,
  ...attrs
}: EditableProps) {
  const t = useUiLocale()
  const [model, setModel] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'Editable',
  })
  const [editing, setEditing] = useControllableState({
    prop: editingProp,
    defaultProp: defaultEditing,
    onChange: onEditingChange,
    caller: 'Editable',
  })
  const { id, labelledBy, describedBy, invalid, disabled } = useFieldControl(
    { disabled: disabledProp, invalid: invalidProp },
    attrs,
  )
  const errorId = `hn-editable-error-${useId()}`
  const singleLine = useRef<HTMLInputElement | null>(null)
  const area = useRef<TextareaHandle | null>(null)

  function nativeInput() {
    return multiline ? (area.current?.input ?? undefined) : (singleLine.current ?? undefined)
  }

  const {
    root,
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
    state,
  } = useEditable({
    model,
    setModel,
    editing,
    setEditing,
    submitMode,
    selectOnFocus,
    multiline,
    readonly,
    onSave,
    input: nativeInput,
    disabled,
    failureMessage: t.editable.failed,
    requiredMessage: t.form.required,
    onEdit: () => onEdit?.(),
    onSubmit: (next, previous) => onSubmit?.(next, previous),
    onCancel: abandoned => onCancel?.(abandoned),
    onError: cause => onError?.(cause),
  })

  const description =
    [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
  const interactive = !readonly && activationMode !== 'manual'
  const isEditing = editing && !blocked
  const scope: EditableControls = {
    editing: isEditing,
    draft,
    dirty,
    saving,
    disabled: blocked,
    error,
    edit,
    submit: () => submit(),
    cancel,
  }
  const ariaLabel = attrs['aria-label'] || (labelledBy ? undefined : t.editable.edit)

  function activate(event: KeyboardEvent<HTMLElement>) {
    if (!interactive || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    edit()
  }

  useImperativeHandle(ref, () => ({
    edit,
    submit: () => submit(),
    cancel,
    focus,
    get input() {
      return nativeInput()
    },
    get draft() {
      return state.current.draft
    },
    get saving() {
      return state.current.saving
    },
    get error() {
      return state.current.error
    },
  }))

  const PreviewTag = interactive ? 'button' : 'div'
  const showActions =
    !!renderActions || (controls && (isEditing || activationMode === 'manual') && !readonly)

  const editorEvents = {
    onChange: (event: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onInput(event),
    onCompositionStart: (event: CompositionEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      attrs.onCompositionStart?.(event)
      onCompositionStart()
    },
    onCompositionEnd: (event: CompositionEvent<HTMLInputElement & HTMLTextAreaElement>) => {
      attrs.onCompositionEnd?.(event)
      onCompositionEnd()
    },
  }

  return (
    <div
      ref={root as Ref<HTMLDivElement>}
      data-hn-editable=""
      data-state={isEditing ? 'editing' : 'preview'}
      data-saving={saving ? '' : undefined}
      aria-busy={saving || undefined}
      className={cn(editable({ size }), className)}
      onBlur={(event: FocusEvent<HTMLElement>) => onFocusout(event)}
      onKeyDown={onKeydown}
    >
      {!isEditing ? (
        <PreviewTag
          ref={preview as Ref<HTMLButtonElement & HTMLDivElement>}
          {...attrs}
          id={id}
          type={interactive ? 'button' : undefined}
          disabled={interactive ? disabled : undefined}
          tabIndex={!interactive && activationMode === 'manual' && !blocked ? 0 : undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={description}
          aria-invalid={invalid || undefined}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          className={editablePreview({ interactive })}
          onClick={(event: MouseEvent<HTMLElement>) => {
            attrs.onClick?.(event)
            if (activationMode === 'click') edit()
          }}
          onDoubleClick={(event: MouseEvent<HTMLElement>) => {
            attrs.onDoubleClick?.(event)
            if (activationMode === 'dblclick') edit()
          }}
          onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
            attrs.onKeyDown?.(event)
            activate(event)
          }}
        >
          <span className={editablePreviewText({ multiline })} data-empty={!model ? '' : undefined}>
            {renderPreview
              ? renderPreview({ value: model, empty: !model })
              : model || placeholder || t.editable.placeholder}
          </span>
          {interactive && !disabled && (
            <PencilIcon aria-hidden="true" className="size-3.5 shrink-0 text-muted" />
          )}
        </PreviewTag>
      ) : multiline ? (
        <Textarea
          ref={area}
          {...attrs}
          {...editorEvents}
          value={draft}
          rows={rows}
          size={size}
          invalid={invalid || !!error}
          id={id}
          required={required}
          maxLength={maxlength}
          placeholder={placeholder ?? t.editable.placeholder}
          readOnly={saving}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={description}
          aria-invalid={invalid || !!error || undefined}
          data-invalid={invalid || error ? '' : undefined}
          className="font-normal"
        />
      ) : (
        <input
          ref={singleLine}
          {...attrs}
          {...editorEvents}
          value={draft}
          type="text"
          id={id}
          required={required}
          maxLength={maxlength}
          placeholder={placeholder ?? t.editable.placeholder}
          readOnly={saving}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={description}
          aria-invalid={invalid || !!error || undefined}
          data-invalid={invalid || error ? '' : undefined}
          className={editableInput()}
        />
      )}
      {name && <input type="hidden" name={name} value={model} disabled={disabled} />}
      {error && (
        <div id={errorId} role="alert" className={editableError()}>
          {error}
        </div>
      )}
      {showActions && (
        <div className={editableActions()}>
          {renderActions ? (
            renderActions(scope)
          ) : isEditing ? (
            <>
              <IconButton
                label={t.editable.save}
                size={size}
                variant="soft"
                tone="accent"
                loading={saving}
                disabled={disabled}
                {...plain}
                onClick={() => void submit()}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                label={t.common.cancel}
                size={size}
                disabled={saving || disabled}
                {...plain}
                onClick={cancel}
              >
                <XIcon />
              </IconButton>
            </>
          ) : (
            <IconButton
              label={t.editable.edit}
              size={size}
              disabled={disabled}
              {...plain}
              onClick={edit}
            >
              <PencilIcon />
            </IconButton>
          )}
        </div>
      )}
    </div>
  )
}
