import 'server-only'
import MarkdownIt from 'markdown-it'
import attrs from 'markdown-it-attrs'
import Token from 'markdown-it/lib/token.mjs'
import NextLink from 'next/link'
import type { ReactNode } from 'react'
import {
  Blockquote,
  Code,
  CodeBlock,
  Divider,
  Heading,
  Link,
  List,
  ListItem,
  Section,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@hina-ui/react'
import { frameworkBlocks } from '../../shared/framework'
import { adaptForReact, type PageApi } from './api'
import { parseBlock, parseControls } from './blocks'
import { loadChangelog } from './changelog'
import { hrefFor, type Locale } from './content'
import { highlight } from './highlight'
import { translator } from './i18n'
import { CategoryGrid } from '~/components/CategoryGrid'
import { ComponentsOverview } from '~/components/ComponentsOverview'
import { DemoBox } from '~/components/DemoBox'
import type { PageModules } from '~/lib/demo-map'
import { DesignColors } from '~/components/design/Colors'
import { DesignGeometry } from '~/components/design/Geometry'
import { DesignMotion } from '~/components/design/Motion'
import { DesignTypography } from '~/components/design/Typography'

const md = new MarkdownIt({ html: true })
  .use(attrs as never, { allowedAttributes: ['id'] })
  .use(frameworkBlocks('react'))

const columnWidths: Record<string, string> = {
  类型: 'min-w-48',
  Type: 'min-w-48',
  参数: 'min-w-40',
  Payload: 'min-w-40',
  Props: 'min-w-40',
  说明: 'min-w-64',
  Description: 'min-w-64',
}

export interface TocItem {
  id: string
  label: string
  children?: TocItem[]
}

interface Node {
  token: Token
  children: Node[]
}

function sections(tokens: Token[]) {
  const result: Token[] = []
  const headings: { id: string; label: string; level: number }[] = []
  let open = false
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]!
    if (token.type !== 'heading_open') {
      result.push(token)
      continue
    }
    const level = Number(token.tag.slice(1))
    let anchor = token.attrGet('id')
    if (!anchor) {
      anchor = `section-${headings.length + 1}`
      token.attrSet('id', anchor)
    }
    const label = (tokens[index + 1]?.children ?? [])
      .filter(child => child.type === 'text' || child.type === 'code_inline')
      .map(child => child.content)
      .join('')
      .trim()
    if (level <= 3) headings.push({ id: anchor, label, level })
    if (level === 2 || level === 3) {
      if (open) result.push(closeSection())
      result.push(openSection(anchor))
      open = true
    }
    result.push(token)
  }
  if (open) result.push(closeSection())
  return { tokens: result, headings }
}

function openSection(id: string) {
  const token = new Token('hn_section_open', '', 1)
  token.attrSet('id', id)
  return token
}

function closeSection() {
  return new Token('hn_section_close', '', -1)
}

function tree(tokens: Token[]) {
  const root: Node[] = []
  const stack: Node[][] = [root]
  for (const token of tokens) {
    const level = stack[stack.length - 1]!
    if (token.nesting === 1) {
      const node: Node = { token, children: [] }
      level.push(node)
      stack.push(node.children)
    } else if (token.nesting === -1) stack.pop()
    else level.push({ token, children: [] })
  }
  return root
}

export function toc(headings: { id: string; label: string; level: number }[], depth = 3) {
  const items: TocItem[] = []
  for (const heading of headings.filter(heading => heading.level <= depth)) {
    const item: TocItem = { id: heading.id, label: heading.label }
    const parent = items[items.length - 1]
    if (heading.level > 2 && parent) (parent.children ??= []).push(item)
    else items.push(item)
  }
  return items
}

interface Context extends PageModules {
  locale: Locale
}

function inline(tokens: Token[], context: Context): ReactNode[] {
  const output: ReactNode[] = []
  const stack: { tag: string; href?: string; children: ReactNode[] }[] = []
  const push = (node: ReactNode) =>
    (stack.length ? stack[stack.length - 1]!.children : output).push(node)
  tokens.forEach((token, index) => {
    const key = `${token.type}-${index}`
    switch (token.type) {
      case 'text':
        push(token.content)
        break
      case 'code_inline':
        push(<Code key={key}>{token.content}</Code>)
        break
      case 'softbreak':
        push('\n')
        break
      case 'hardbreak':
        push(<br key={key} />)
        break
      case 'strong_open':
      case 'em_open':
      case 'link_open':
        stack.push({ tag: token.type, href: token.attrGet('href') ?? undefined, children: [] })
        break
      case 'strong_close':
      case 'em_close':
      case 'link_close': {
        const frame = stack.pop()!
        if (frame.tag === 'strong_open') push(<strong key={key}>{frame.children}</strong>)
        else if (frame.tag === 'em_open') push(<em key={key}>{frame.children}</em>)
        else if (frame.href?.startsWith('/'))
          push(
            <Link key={key} asChild>
              <NextLink href={hrefFor(context.locale, frame.href)}>{frame.children}</NextLink>
            </Link>,
          )
        else
          push(
            <Link key={key} href={frame.href} target="_blank" rel="noreferrer">
              {frame.children}
            </Link>,
          )
        break
      }
      case 'html_inline':
        break
      default:
        push(token.content)
    }
  })
  return output
}

function custom(source: string, key: string, context: Context): ReactNode | undefined {
  const tag = parseBlock(source)
  if (!tag) return undefined
  const { locale } = context
  const t = translator(locale)
  switch (tag.name) {
    case 'Demo':
      return tag.attrs.name ? (
        <DemoBox
          key={key}
          name={tag.attrs.name}
          locale={locale}
          Demo={context.demos[tag.attrs.name]}
        />
      ) : null
    case 'CategoryGrid':
      return tag.attrs.slug ? (
        <CategoryGrid key={key} slug={tag.attrs.slug} locale={locale} demos={context.demos} />
      ) : null
    case 'ComponentsOverview':
      return <ComponentsOverview key={key} locale={locale} />
    case 'Playground': {
      const name = tag.attrs.name
      const Wrapped = name ? context.playgrounds[name] : undefined
      return name && Wrapped ? (
        <Wrapped
          key={key}
          name={name}
          label={tag.attrs.label}
          controls={parseControls(tag.attrs[':controls'])}
        />
      ) : null
    }
    case 'DesignColors':
      return <DesignColors key={key} locale={locale} />
    case 'DesignTypography':
      return <DesignTypography key={key} locale={locale} />
    case 'DesignGeometry':
      return <DesignGeometry key={key} locale={locale} />
    case 'DesignMotion':
      return (
        <DesignMotion
          key={key}
          hint={t('designPreview.motionHint')}
          replay={t('designPreview.replay')}
        />
      )
    default:
      return undefined
  }
}

async function blocks(nodes: Node[], context: Context): Promise<ReactNode[]> {
  return Promise.all(nodes.map((node, index) => block(node, index, context)))
}

async function table(node: Node, key: string, context: Context) {
  const head = node.children.find(child => child.token.type === 'thead_open')
  const body = node.children.find(child => child.token.type === 'tbody_open')
  const columns = (head?.children[0]?.children ?? []).map(cell =>
    (cell.children[0]?.token.children ?? [])
      .map(child => child.content)
      .join('')
      .trim(),
  )
  const cell = (cellNode: Node, column: number, header: boolean, cellKey: string) => {
    const content = inline(cellNode.children[0]?.token.children ?? [], context)
    const width = columnWidths[columns[column] ?? '']
    const wrapped = width ? <div className={width}>{content}</div> : content
    return header ? (
      <TableHead key={cellKey}>{wrapped}</TableHead>
    ) : (
      <TableCell key={cellKey}>{wrapped}</TableCell>
    )
  }
  const rows = (group: Node | undefined, header: boolean) =>
    (group?.children ?? []).map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {row.children.map((cellNode, column) =>
          cell(cellNode, column, header, `${rowIndex}-${column}`),
        )}
      </TableRow>
    ))
  return (
    <Table key={key} variant="secondary">
      <TableHeader>{rows(head, true)}</TableHeader>
      <TableBody>{rows(body, false)}</TableBody>
    </Table>
  )
}

async function block(node: Node, index: number, context: Context): Promise<ReactNode> {
  const { token } = node
  const key = `${token.type}-${index}`
  switch (token.type) {
    case 'hn_section_open':
      return (
        <Section key={key} id={token.attrGet('id') ?? undefined}>
          {await blocks(node.children, context)}
        </Section>
      )
    case 'heading_open': {
      const level = Number(token.tag.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6
      const id = token.attrGet('id') ?? undefined
      return (
        <Heading key={key} level={level} id={id} className={id ? 'scroll-mt-6' : undefined}>
          {inline(node.children[0]?.token.children ?? [], context)}
        </Heading>
      )
    }
    case 'paragraph_open': {
      const children = node.children[0]?.token.children ?? []
      if (children.length === 1 && children[0]!.type === 'html_inline') {
        const block = custom(children[0]!.content, key, context)
        if (block !== undefined) return block
      }
      const content = inline(children, context)
      return token.hidden ? (
        content
      ) : (
        <Text key={key} tone="muted">
          {content}
        </Text>
      )
    }
    case 'inline':
      return inline(token.children ?? [], context)
    case 'bullet_list_open':
    case 'ordered_list_open':
      return (
        <List key={key} ordered={token.type === 'ordered_list_open'}>
          {await blocks(node.children, context)}
        </List>
      )
    case 'list_item_open':
      return <ListItem key={key}>{await blocks(node.children, context)}</ListItem>
    case 'blockquote_open':
      return <Blockquote key={key}>{await blocks(node.children, context)}</Blockquote>
    case 'hr':
      return <Divider key={key} />
    case 'table_open':
      return table(node, key, context)
    case 'fence': {
      const lang = token.info.trim()
      return (
        <CodeBlock
          key={key}
          code={token.content}
          lang={lang || undefined}
          html={lang ? await highlight(token.content, lang) : undefined}
        />
      )
    }
    case 'html_block':
      return custom(token.content, key, context) ?? null
    default:
      return null
  }
}

export async function renderMarkdown(
  source: string,
  locale: Locale,
  path: string,
  modules: PageModules,
  api: PageApi,
) {
  const raw = md.parse(await loadChangelog(source), {})
  const parsed = path === 'changelog' ? raw : adaptForReact(raw, locale, api)
  const { tokens, headings } = sections(parsed)
  return { content: await blocks(tree(tokens), { locale, ...modules }), headings }
}
