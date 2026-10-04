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
  const [notes, setNotes] = useState(['Weekly design review', 'Next release checklist'])

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
          Workspace notes
        </Heading>
        <Stack gap="sm">
          {notes.map((note, index) => (
            <Text key={index} className="border-line border-b pb-3">
              {note}
            </Text>
          ))}
        </Stack>
      </Stack>
      <FloatButton position="absolute" label="New note" onClick={() => setOpen(true)}>
        <Plus />
      </FloatButton>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="New note"
        description="Give your new note a title."
        renderContent={() => (
          <FormField label="Note title">
            <Input
              value={title}
              onValueChange={setTitle}
              placeholder="For example: interaction details"
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
              Cancel
            </Button>
            <Button disabled={!title.trim()} onClick={create}>
              Create
            </Button>
          </>
        )}
      />
    </Card>
  )
}
