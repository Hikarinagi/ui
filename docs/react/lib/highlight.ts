import 'server-only'
import { tokenize, tokensToHtml } from '../../../packages/shared/src/lib/highlighter'

export async function highlight(code: string, lang: string) {
  const lines = await tokenize(code, lang)
  return lines ? tokensToHtml(lines) : undefined
}
