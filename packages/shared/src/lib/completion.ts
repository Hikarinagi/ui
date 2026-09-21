export interface CompletionContext {
  text: string
  selectionStart: number
  selectionEnd: number
}

export interface CompletionEdit {
  range: [number, number]
  text: string
  keepOpen?: boolean
}

export function applyCompletion(
  context: CompletionContext,
  edit: CompletionEdit,
): CompletionContext {
  const [start, end] = edit.range
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    end > context.text.length
  )
    throw new RangeError('Completion range must be within the current text')
  const caret = start + edit.text.length
  return {
    text: context.text.slice(0, start) + edit.text + context.text.slice(end),
    selectionStart: caret,
    selectionEnd: caret,
  }
}
