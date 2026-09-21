export type EditableActivationMode = 'click' | 'dblclick' | 'manual'
export type EditableSubmitMode = 'enter' | 'blur' | 'both' | 'manual'
export type EditableSave = (value: string, previousValue: string) => void | Promise<void>

export interface EditableProps {
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
  class?: string
}

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
