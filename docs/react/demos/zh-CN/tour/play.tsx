'use client'

import { useMemo, useState } from 'react'
import { Button, Drawer, Inline, List, ListItem, Text, Tour, type TourStep } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [contents, setContents] = useState(false)
  const [page, setPage] = useState(12)

  const steps = useMemo<TourStep[]>(
    () => [
      {
        target: '#tour-play-contents',
        title: '目录',
        description: '点这里打开目录。',
        play: async ({ pointer }) => {
          await pointer.move('#tour-play-contents')
          await pointer.tap()
        },
      },
      {
        target: '#tour-play-chapter',
        title: '跳到章节',
        description: '目录里点章节名就能跳过去。',
        wait: 2000,
        play: async ({ pointer, defer, waitFor }) => {
          setContents(true)
          defer(() => setContents(false))
          await waitFor('#tour-play-chapter')
          await pointer.move('#tour-play-chapter')
          await pointer.tap()
        },
      },
      {
        target: '#tour-play-page',
        title: '翻页',
        description: '按 ← 和 → 翻页。',
        play: async ({ pointer, sleep }) => {
          await pointer.key('→')
          setPage(value => value + 1)
          await sleep(400)
          await pointer.key('←')
          setPage(value => value - 1)
        },
      },
    ],
    [],
  )

  function start() {
    setStep(1)
    setOpen(true)
  }

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button
          id="tour-play-contents"
          variant="outline"
          tone="neutral"
          onClick={() => setContents(true)}
        >
          目录
        </Button>
        <Text id="tour-play-page" tone="muted" className="tabular-nums">
          第 {page} 页
        </Text>
        <Button variant="ghost" tone="neutral" onClick={start}>
          看看怎么用
        </Button>
      </Inline>
      <Drawer
        open={contents}
        onOpenChange={setContents}
        title="目录"
        renderContent={() => (
          <List>
            <ListItem>第一章 春分</ListItem>
            <ListItem>第二章 远雷</ListItem>
            <ListItem id="tour-play-chapter">第三章 雨夜</ListItem>
          </List>
        )}
      />
      <Tour
        open={open}
        onOpenChange={setOpen}
        step={step}
        onStepChange={setStep}
        steps={steps}
        mask="dim"
        blockPage
      />
    </>
  )
}
