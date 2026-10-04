'use client'

import { BookOpen } from 'lucide-react'
import { Button, Heading, Inline, Stack, Text, toast } from '@hina-ui/react'

function ChapterToast({ title, chapter }: { title: string; chapter: string }) {
  return (
    <Inline align="center" className="gap-3">
      <div className="bg-inset grid size-10 shrink-0 place-items-center rounded-md">
        <BookOpen className="size-5" />
      </div>
      <Stack gap="none" className="min-w-0 flex-1">
        <Heading level={4} size="sm">
          {title}
        </Heading>
        <Text tone="muted" size="sm">
          {chapter}
        </Text>
      </Stack>
      <Button size="sm" onClick={() => toast.dismiss('chapter')}>
        去阅读
      </Button>
    </Inline>
  )
}

function notify() {
  toast.custom(ChapterToast, {
    id: 'chapter',
    duration: 6000,
    props: { title: 'ATRI', chapter: '第 42 话' },
  })
}

export default function Demo() {
  return (
    <Button variant="outline" tone="neutral" onClick={notify}>
      新章节上线
    </Button>
  )
}
