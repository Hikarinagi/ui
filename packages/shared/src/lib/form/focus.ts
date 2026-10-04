const FOCUSABLE = 'input,select,textarea,button,[tabindex],[contenteditable="true"]'

export function focusFirstInvalid(root: HTMLElement) {
  const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]')
  if (!invalid) return
  const target = invalid.matches(FOCUSABLE)
    ? invalid
    : invalid.querySelector<HTMLElement>(FOCUSABLE)
  target?.focus()
}
