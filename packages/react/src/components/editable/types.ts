import type { HTMLAttributes, ReactNode, Ref } from 'react'

export type EditableActivationMode = 'click' | 'dblclick' | 'manual'
export type EditableSubmitMode = 'enter' | 'blur' | 'both' | 'manual'
export type EditableSave = (value: string, previousValue: string) => void | Promise<void>

export interface EditableControls {
  editing: boolean
  draft: string
  dirty: boolean
  saving: boolean
  disabled: boolean
  error: string
  edit: () => void
  submit: () => Promise<boolean>
  cancel: () => void
}

export interface EditableHandle {
  edit: () => void
  submit: () => Promise<boolean>
  cancel: () => void
  focus: (select?: boolean) => void
  readonly input: HTMLInputElement | HTMLTextAreaElement | undefined
  readonly draft: string
  readonly saving: boolean
  readonly error: string
}

export interface EditableProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onSubmit' | 'onError' | 'onCancel' | 'onChange' | 'placeholder'
> {
  activationMode?: EditableActivationMode
  submitMode?: EditableSubmitMode
  selectOnFocus?: boolean
  multiline?: boolean
  rows?: number
  controls?: boolean
  placeholder?: string
  name?: string
  required?: boolean
  maxlength?: number
  disabled?: boolean
  readonly?: boolean
  invalid?: boolean
  size?: 'sm' | 'md' | 'lg'
  onSave?: EditableSave
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  editing?: boolean
  defaultEditing?: boolean
  onEditingChange?: (editing: boolean) => void
  onEdit?: () => void
  onSubmit?: (value: string, previousValue: string) => void
  onCancel?: (draft: string) => void
  onError?: (error: unknown) => void
  renderPreview?: (props: { value: string; empty: boolean }) => ReactNode
  renderActions?: (props: EditableControls) => ReactNode
  ref?: Ref<EditableHandle>
  [attribute: `data-${string}`]: string | undefined
}
