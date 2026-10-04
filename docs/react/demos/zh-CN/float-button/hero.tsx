'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Button,
  Card,
  Dialog,
  FloatButton,
  FormField,
  Heading,
  Input,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState(['本周设计回顾', '下一版组件清单'])

  function create() {
    if (!title.trim()) return
    setNotes([...notes, title.trim()])
    setTitle('')
    setOpen(false)
  }

  return (
    <Card className="relative min-h-72 w-full max-w-md pb-24">
      <Stack gap="lg">
        <Heading level={3} size="base">
          工作笔记
        </Heading>
        <Stack gap="sm">
          {notes.map((note, index) => (
            <Text key={index} className="border-line border-b pb-3">
              {note}
            </Text>
          ))}
        </Stack>
      </Stack>
      <FloatButton position="absolute" label="新建笔记" onClick={() => setOpen(true)}>
        <Plus />
      </FloatButton>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="新建笔记"
        description="为新的笔记填写标题。"
        renderContent={() => (
          <FormField label="笔记标题">
            <Input
              value={title}
              onValueChange={setTitle}
              placeholder="例如：交互细节"
              onKeyDown={event => {
                if (event.key !== 'Enter') return
                event.preventDefault()
                create()
              }}
            />
          </FormField>
        )}
        renderFooter={() => (
          <>
            <Button variant="soft" tone="neutral" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button disabled={!title.trim()} onClick={create}>
              创建
            </Button>
          </>
        )}
      />
    </Card>
  )
}
