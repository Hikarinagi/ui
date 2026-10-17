'use client'

import { useMemo, useState } from 'react'
import { Button, Drawer, Inline, List, ListItem, Text, Tour, type TourStep } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [contents, setContents] = useState(false)
  const [page, setPage] = useState(12)

  const steps = useMemo<TourStep[]>(
    () => [
      {
        target: '#tour-play-contents',
        title: 'Contents',
        description: 'Open the contents here.',
        play: async ({ pointer }) => {
          await pointer.move('#tour-play-contents')
          await pointer.tap()
        },
      },
      {
        target: '#tour-play-chapter',
        title: 'Jump to a chapter',
        description: 'Pick a chapter in the contents to go there.',
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
        title: 'Turn pages',
        description: 'Press ← and → to turn pages.',
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

  return (
    <>
      <Inline gap="sm" align="center" wrap>
        <Button
          id="tour-play-contents"
          variant="outline"
          tone="neutral"
          onClick={() => setContents(true)}
        >
          Contents
        </Button>
        <Text id="tour-play-page" tone="muted" className="tabular-nums">
          Page {page}
        </Text>
        <Button variant="ghost" tone="neutral" onClick={() => setOpen(true)}>
          Show me how
        </Button>
      </Inline>
      <Drawer
        open={contents}
        onOpenChange={setContents}
        title="Contents"
        renderContent={() => (
          <List>
            <ListItem>Chapter 1 · Equinox</ListItem>
            <ListItem>Chapter 2 · Distant thunder</ListItem>
            <ListItem id="tour-play-chapter">Chapter 3 · Night rain</ListItem>
          </List>
        )}
      />
      <Tour open={open} onOpenChange={setOpen} steps={steps} mask="dim" blockPage />
    </>
  )
}
