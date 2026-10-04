'use client'

import { useState } from 'react'
import {
  Affix,
  Button,
  Card,
  FormField,
  Heading,
  Inline,
  Input,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from '@hina-ui/react'

export default function Demo() {
  const [draft, setDraft] = useState({
    title: 'Component design review',
    author: 'Design team',
    summary: '',
    notes: '',
  })
  const [saved, setSaved] = useState(false)
  const update = (patch: Partial<typeof draft>) => {
    setDraft(draft => ({ ...draft, ...patch }))
    setSaved(false)
  }
  return (
    <Card padded={false} className="w-full max-w-xl">
      <ScrollArea className="h-96" shadow={false} focusable label="Edit article">
        <Stack className="p-4" gap="lg">
          <Heading level={3} size="base">
            Edit article
          </Heading>
          <FormField label="Title">
            <Input value={draft.title} onValueChange={title => update({ title })} />
          </FormField>
          <FormField label="Author">
            <Input value={draft.author} onValueChange={author => update({ author })} />
          </FormField>
          <FormField label="Summary" description="A short introduction for article lists.">
            <Textarea
              value={draft.summary}
              onValueChange={summary => update({ summary })}
              rows={4}
              placeholder="What is this article about?"
            />
          </FormField>
          <FormField label="Editorial notes" description="Leave context for the next editor.">
            <Textarea
              value={draft.notes}
              onValueChange={notes => update({ notes })}
              rows={4}
              placeholder="Explain changes or open questions"
            />
          </FormField>
          <Affix position="bottom" offset={12}>
            <Card className="p-3">
              <Inline align="center" justify="between" gap="sm" wrap>
                <Text role="status" size="sm" tone="muted">
                  {saved ? 'Draft saved in this demo' : 'Changes stay in this demo'}
                </Text>
                <Button
                  size="sm"
                  disabled={!draft.title.trim() || saved}
                  onClick={() => setSaved(true)}
                >
                  Save draft
                </Button>
              </Inline>
            </Card>
          </Affix>
        </Stack>
      </ScrollArea>
    </Card>
  )
}
