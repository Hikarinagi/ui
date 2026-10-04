import type { CompletionContext } from '@hina-ui/vue'

export function queryToken(context: CompletionContext) {
  const { text, selectionStart, selectionEnd } = context
  const start = selectionStart > 0 ? text.lastIndexOf(' ', selectionStart - 1) + 1 : 0
  const nextSpace = text.indexOf(' ', selectionEnd)
  const end = nextSpace < 0 ? text.length : nextSpace
  const colon = text.indexOf(':', start)
  const hasKey = colon >= start && colon < selectionStart
  const rangeStart = hasKey ? colon + 1 : start
  return {
    key: hasKey ? text.slice(start, colon) : '',
    prefix: text.slice(rangeStart, selectionStart).toLowerCase(),
    range: [rangeStart, !hasKey && colon >= start && colon < end ? colon + 1 : end] as [
      number,
      number,
    ],
  }
}

export const queryValues: Record<string, string[]> = {
  entry: ['http', 'rpc', 'job', 'consumer'],
  status: ['ok', 'error', 'timeout'],
  duration: ['>500ms', '>1s', '>5s'],
  service: ['gateway', 'catalog', 'checkout', 'worker'],
}
