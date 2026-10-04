import 'server-only'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import attrs from 'markdown-it-attrs'
import type Token from 'markdown-it/lib/token.mjs'
import { adaptForReact, reactSource, sourceApi } from './api'
import { parseBlock, parseControls, playgroundCode } from './blocks'
import { loadChangelog } from './changelog'
import { contentRoot, type Locale } from './content'
import { reactHref } from './links'
import { translator } from './i18n'

const md = new MarkdownIt({ html: true }).use(attrs as never, { allowedAttributes: ['id'] })

const ANCHOR = /^(#{2,6} .+?)\s*\{#[\w-]+\}$/gm
const HEADING = /^(#{1,6}\s+)(.*?)(\s*\{#[\w-]+\})?\s*$/

function fence(code: string, lang = 'tsx') {
  return `\`\`\`${lang}\n${code.trim()}\n\`\`\``
}

function split(source: string) {
  const match = /^---\n[\s\S]*?\n---\n?/.exec(source)
  return match
    ? { head: match[0], body: source.slice(match[0].length) }
    : { head: '', body: source }
}

function reactHead(head: string) {
  const lines = head.split('\n')
  const output: string[] = []
  for (let index = 0; index < lines.length; index += 1) {
    const href = /^(\s*href:\s*)(\S+)\s*$/.exec(lines[index + 1] ?? '')
    if (/^\s*- label:/.test(lines[index]!) && href) {
      const next = reactHref(href[2]!)
      if (next) output.push(lines[index]!, `${href[1]}${next}`)
      index += 1
      continue
    }
    output.push(lines[index]!)
  }
  return output
    .filter((line, index) => line !== 'links:' || /^\s+-/.test(output[index + 1] ?? ''))
    .join('\n')
}

function serialize(children: Token[]) {
  return children
    .map(child =>
      child.type === 'code_inline'
        ? `${child.markup}${child.content}${child.markup}`
        : child.content,
    )
    .join('')
}

async function demoSource(locale: Locale, name: string) {
  try {
    return await readFile(join(process.cwd(), 'demos', locale, `${name}.tsx`), 'utf8')
  } catch {
    return undefined
  }
}

function playground(source: string, locale: Locale) {
  const tag = parseBlock(source)
  if (!tag?.attrs.name) return undefined
  const t = translator(locale)
  const controls = parseControls(tag.attrs[':controls'])
  const props = controls.map(control => `\`${control.prop}\``).join(t('markdown.separator'))
  const adjustable = props ? `${t('markdown.adjustable', { props })}\n\n` : ''
  return `${adjustable}${fence(playgroundCode(tag.attrs.name, tag.attrs.label, controls))}`
}

export async function rawMarkdown(locale: Locale, path: string) {
  let source: string
  try {
    source = await readFile(join(contentRoot, locale, `${path}.md`), 'utf8')
  } catch {
    return undefined
  }
  const api = sourceApi(source, path)
  const { head, body } = split(reactSource(await loadChangelog(source), locale, path, api))
  const lines = body.split('\n')
  const tokens = md.parse(body, {})
  const original = tokens.map(token => ({
    content: token.content,
    children: token.children?.map(child => ({ content: child.content })) ?? [],
  }))
  if (path !== 'changelog') adaptForReact(tokens, locale, api)

  const cursors = new Map<number, number>()
  const replaced = new Map<number, string>()
  const removed = new Set<number>()

  const replaceInLine = (line: number, from: string, to: string) => {
    const text = lines[line] ?? ''
    const at = text.indexOf(from, cursors.get(line) ?? 0)
    if (at < 0) return
    lines[line] = text.slice(0, at) + to + text.slice(at + from.length)
    cursors.set(line, at + to.length)
  }

  let region: [number, number] = [0, 0]
  for (const [index, token] of tokens.entries()) {
    if (token.map) region = token.map as [number, number]
    const [start, end] = region

    if (token.type === 'fence' && token.content !== original[index]!.content) {
      const previous = original[index]!.content.split('\n')
      const next = token.content.split('\n')
      if (previous.length === next.length) {
        for (const [offset, line] of next.entries())
          if (line !== previous[offset])
            lines[start + 1 + offset] = (lines[start + 1 + offset] ?? '').replace(
              previous[offset]!,
              line,
            )
      } else {
        replaced.set(start + 1, token.content.replace(/\n$/, ''))
        for (let line = start + 2; line < end - 1; line += 1) removed.add(line)
      }
      continue
    }

    if (token.type === 'html_block') {
      const tag = parseBlock(token.content)
      if (/^<script\s+setup\b/.test(token.content)) {
        for (let line = start; line < end; line += 1) removed.add(line)
      } else if (tag?.name === 'Demo' && tag.attrs.name) {
        const code = await demoSource(locale, tag.attrs.name)
        if (code !== undefined) {
          replaced.set(start, fence(code))
          for (let line = start + 1; line < end; line += 1) removed.add(line)
        }
      }
      continue
    }

    if (token.type !== 'inline') continue
    const children = token.children ?? []
    const before = original[index]!.children

    if (children.length === 1 && children[0]!.type === 'html_inline') {
      const expansion = playground(children[0]!.content, locale)
      if (expansion !== undefined) {
        replaced.set(start, expansion)
        for (let line = start + 1; line < end; line += 1) removed.add(line)
        continue
      }
    }

    if (children.length !== before.length) {
      const next = serialize(children)
      const heading = tokens[index - 1]?.type === 'heading_open'
      if (heading)
        lines[start] = (lines[start] ?? '').replace(
          HEADING,
          (_match, hashes: string, _text: string, anchor = '') => `${hashes}${next}${anchor}`,
        )
      else replaceInLine(start, original[index]!.content, next)
      continue
    }

    const offsets = lines.slice(start, end)
    const joined = offsets.join('\n')
    let cursor = start === end - 1 ? (cursors.get(start) ?? 0) : 0
    let text = joined
    for (const [position, child] of children.entries()) {
      const previous = before[position]!.content
      if (child.content === previous || (child.type !== 'code_inline' && child.type !== 'text'))
        continue
      const markup = child.type === 'code_inline' ? child.markup : ''
      const from = `${markup}${previous}${markup}`
      const to = `${markup}${child.content}${markup}`
      const at = text.indexOf(from, cursor)
      if (at < 0) continue
      text = text.slice(0, at) + to + text.slice(at + from.length)
      cursor = at + to.length
    }
    if (text !== joined) lines.splice(start, end - start, ...text.split('\n'))
    if (start === end - 1) cursors.set(start, cursor)
  }

  const output = lines
    .map((line, index) => (replaced.has(index) ? replaced.get(index)! : line))
    .filter((_line, index) => !removed.has(index))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(ANCHOR, '$1')
    .replace(/^\n+/, '\n')
  return `${reactHead(head)}${output}`
}
