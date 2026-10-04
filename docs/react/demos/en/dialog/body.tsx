'use client'

import { useState } from 'react'
import { AtSign, Globe, ImagePlus, Smile } from 'lucide-react'
import {
  Avatar,
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Image,
  Inline,
  ScrollArea,
  Stack,
  Text,
  Textarea,
} from '@hina-ui/react'

export default function Demo() {
  const [content, setContent] = useState('')
  const [attached, setAttached] = useState(false)
  const count = Array.from(content).length
  const overLimit = count > 280

  return (
    <Dialog
      title="New post"
      placement="top"
      className="max-w-[600px]"
      renderBody={({ close }) => (
        <Stack gap="none" className="min-h-0">
          <Inline justify="between" className="border-line shrink-0 border-b px-3 py-2.5">
            <Button variant="ghost" tone="neutral" size="sm" onClick={close}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={(!content.trim() && !attached) || overLimit}
              onClick={close}
            >
              Post
            </Button>
          </Inline>

          <ScrollArea className="min-h-0">
            <Inline align="start" wrap={false} className="gap-3 p-4">
              <Avatar src="/avatars/paper.webp" name="Shion" />
              <Stack gap="sm" className="min-w-0 flex-1">
                <Stack gap="xs">
                  <Text weight="medium">Shion</Text>
                  <Inline gap="xs">
                    <Globe className="text-muted size-3.5" aria-hidden="true" />
                    <Text size="xs" tone="muted">
                      Public
                    </Text>
                  </Inline>
                </Stack>
                <Textarea
                  value={content}
                  onValueChange={setContent}
                  variant="bare"
                  autosize={{ minRows: 5 }}
                  invalid={overLimit}
                  aria-label="Post content"
                  placeholder="Share a discovery, a recommendation, or a thought…"
                  className="[--hn-textarea-px:0px]"
                />
                {attached && (
                  <Stack className="relative">
                    <Image
                      src="/sample.webp"
                      alt="Sample image"
                      className="aspect-video w-full rounded-md"
                    />
                    <CloseButton
                      label="Remove image"
                      className="bg-surface/90 absolute top-2 right-2 shadow-sm"
                      onClick={() => setAttached(false)}
                    />
                  </Stack>
                )}
              </Stack>
            </Inline>
          </ScrollArea>

          <Inline
            justify="between"
            wrap={false}
            className="border-line shrink-0 border-t px-3 py-2"
          >
            <Inline gap="xs">
              <IconButton
                label="Add sample image"
                size="sm"
                aria-pressed={attached}
                onClick={() => setAttached(!attached)}
              >
                <ImagePlus />
              </IconButton>
              <IconButton label="Insert emoji" size="sm" onClick={() => setContent(content + '😊')}>
                <Smile />
              </IconButton>
              <IconButton label="Insert @" size="sm" onClick={() => setContent(content + '@')}>
                <AtSign />
              </IconButton>
            </Inline>
            <Text
              as="span"
              size="xs"
              tone={overLimit ? 'danger' : 'muted'}
              className="shrink-0 tabular-nums"
            >
              {count} / 280
            </Text>
          </Inline>
        </Stack>
      )}
    >
      <Button variant="outline" tone="neutral">
        Custom panel
      </Button>
    </Dialog>
  )
}
