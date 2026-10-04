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
      title="发布动态"
      placement="top"
      className="max-w-[600px]"
      renderBody={({ close }) => (
        <Stack gap="none" className="min-h-0">
          <Inline justify="between" className="border-line shrink-0 border-b px-3 py-2.5">
            <Button variant="ghost" tone="neutral" size="sm" onClick={close}>
              取消
            </Button>
            <Button
              size="sm"
              disabled={(!content.trim() && !attached) || overLimit}
              onClick={close}
            >
              发布
            </Button>
          </Inline>

          <ScrollArea className="min-h-0">
            <Inline align="start" wrap={false} className="gap-3 p-4">
              <Avatar src="/avatars/paper.webp" name="星见书音" />
              <Stack gap="sm" className="min-w-0 flex-1">
                <Stack gap="xs">
                  <Text weight="medium">星见书音</Text>
                  <Inline gap="xs">
                    <Globe className="text-muted size-3.5" aria-hidden="true" />
                    <Text size="xs" tone="muted">
                      公开
                    </Text>
                  </Inline>
                </Stack>
                <Textarea
                  value={content}
                  onValueChange={setContent}
                  variant="bare"
                  autosize={{ minRows: 5 }}
                  invalid={overLimit}
                  aria-label="动态正文"
                  placeholder="分享你的发现、推荐或此刻的想法…"
                  className="[--hn-textarea-px:0px]"
                />
                {attached && (
                  <Stack className="relative">
                    <Image
                      src="/sample.webp"
                      alt="示例图片"
                      className="aspect-video w-full rounded-md"
                    />
                    <CloseButton
                      label="移除图片"
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
                label="添加示例图片"
                size="sm"
                aria-pressed={attached}
                onClick={() => setAttached(!attached)}
              >
                <ImagePlus />
              </IconButton>
              <IconButton label="插入表情" size="sm" onClick={() => setContent(content + '😊')}>
                <Smile />
              </IconButton>
              <IconButton label="插入 @" size="sm" onClick={() => setContent(content + '@')}>
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
        自定义面板
      </Button>
    </Dialog>
  )
}
