'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Button, Card, Center, CodeBlock, TRANSITION, cn } from '@hina-ui/react'

const PEEK = 112
const FADE = 56
const mask = `linear-gradient(to bottom, #000 calc(100% - var(--demo-fade, ${FADE}px)), transparent 100%)`

interface DemoFrameProps {
  code: string
  lang?: string
  html?: string
  expandLabel: string
  collapseLabel: string
  children?: ReactNode
}

export function DemoFrame({
  code,
  lang = 'tsx',
  html,
  expandLabel,
  collapseLabel,
  children,
}: DemoFrameProps) {
  const collapsible = code.split('\n').length > 8
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const expanded = !collapsible || open
  const height = collapsible ? (target ?? PEEK) : 'auto'

  function toggle() {
    if (open) {
      setTarget(null)
      setOpen(false)
      return
    }
    setOpen(true)
    setTarget(box.current?.scrollHeight ?? null)
  }

  return (
    <Card padded={false} className="relative overflow-hidden">
      <Center className="min-h-80 p-10">{children}</Center>
      <motion.div
        ref={box}
        initial={false}
        animate={{ height, '--demo-fade': `${expanded ? 0 : FADE}px` }}
        transition={TRANSITION.layout}
        style={collapsible ? { maskImage: mask, maskRepeat: 'no-repeat' } : undefined}
        className="border-line overflow-hidden border-t"
      >
        <CodeBlock
          code={code}
          lang={lang}
          html={html}
          className={cn(
            '[&_.hn-pre]:rounded-none [&_.hn-pre]:border-0',
            collapsible && '[&_.hn-pre-content]:pb-14',
          )}
        />
      </motion.div>
      {collapsible && (
        <Button
          variant="outline"
          tone="neutral"
          size="sm"
          pill
          className="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-sm"
          aria-expanded={open}
          onClick={toggle}
        >
          {open ? collapseLabel : expandLabel}
        </Button>
      )}
    </Card>
  )
}
