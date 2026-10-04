'use client'

import { useState } from 'react'
import { Button, Inline, Popconfirm, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [comments, setComments] = useState([
    'Great chapter, looking forward to the next one.',
    'Is this plot different from the original?',
    'Bookmarked.',
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
            title="Delete this comment?"
            description="This cannot be undone."
            tone="danger"
            confirmText="Delete"
            onConfirm={() => remove(index)}
          >
            <Button size="sm" variant="ghost" tone="neutral">
              Delete
            </Button>
          </Popconfirm>
        </Inline>
      ))}
      {!comments.length ? (
        <Text tone="muted" size="sm">
          No comments left.
        </Text>
      ) : null}
    </Stack>
  )
}
