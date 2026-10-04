'use client'

import { Fragment, type CSSProperties, type HTMLAttributes, type Ref } from 'react'
import type { ThemedToken } from 'shiki/core'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { CopyButton } from '../copy-button/CopyButton'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { useCodeHighlight } from './hooks/useCodeHighlight'
import {
  codeBlock,
  codeBlockArea,
  codeBlockContent,
  codeBlockActions,
  codeBlockLabel,
} from './code-block.variants'

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string
  lang?: string
  label?: string
  html?: string
  copyable?: boolean
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

function tokenStyle(style: ThemedToken['htmlStyle']) {
  if (!style) return undefined
  return Object.fromEntries(
    Object.entries(style).map(([key, value]) => [
      key.startsWith('--')
        ? key
        : key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
      value,
    ]),
  ) as CSSProperties
}

export function CodeBlock({
  code,
  lang,
  label,
  html,
  copyable = true,
  className,
  ...attrs
}: CodeBlockProps) {
  const t = useUiLocale()
  const tag = label ?? lang
  const tokens = useCodeHighlight({ code, lang, html })

  return (
    <div data-lang={lang} {...attrs} className={cn(codeBlock(), className)}>
      <ScrollArea direction="both" focusable label={tag} className={codeBlockArea()}>
        <pre className={codeBlockContent()}>
          {html ? (
            <code dangerouslySetInnerHTML={{ __html: html }} />
          ) : tokens ? (
            <code>
              {tokens.map((line, i) => (
                <Fragment key={i}>
                  {i ? '\n' : ''}
                  {line.map((token, j) => (
                    <span key={j} style={tokenStyle(token.htmlStyle)}>
                      {token.content}
                    </span>
                  ))}
                </Fragment>
              ))}
            </code>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </ScrollArea>
      <div className={codeBlockActions()}>
        {tag ? <span className={codeBlockLabel()}>{tag}</span> : null}
        {copyable ? <CopyButton text={code} label={t.codeblock.copy} /> : null}
      </div>
    </div>
  )
}
