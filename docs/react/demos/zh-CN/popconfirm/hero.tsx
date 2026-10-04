'use client'

import { useState } from 'react'
import { Button, Inline, Popconfirm, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [comments, setComments] = useState([
    '写得真好，期待下一章。',
    '这段剧情和原作不一样吧？',
    '已收藏。',
  ])

  function remove(index: number) {
    setComments(current => current.filter((_, position) => position !== index))
  }

  return (
    <Stack gap="sm" align="stretch" className="w-96">
      {comments.map((comment, index) => (
        <Inline key={comment} align="center" justify="between" gap="sm">
          <Text size="sm">{comment}</Text>
          <Popconfirm
            title="删除这条评论？"
            description="删除后无法恢复。"
            tone="danger"
            confirmText="删除"
            onConfirm={() => remove(index)}
          >
            <Button size="sm" variant="ghost" tone="neutral">
              删除
            </Button>
          </Popconfirm>
        </Inline>
      ))}
      {!comments.length ? (
        <Text tone="muted" size="sm">
          没有评论了。
        </Text>
      ) : null}
    </Stack>
  )
}
