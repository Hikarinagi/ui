'use client'

import { useId, useState } from 'react'
import { Button, Highlight, Inline } from '@hina-ui/react'

const items = ['All', 'Galgame', 'Light novel', 'Manga']

export default function Demo() {
  const [current, setCurrent] = useState(0)
  const id = useId()

  return (
    <Inline gap="none" className="bg-inset relative isolate rounded-md p-1">
      {items.map((item, index) => (
        <Button
          key={item}
          variant="ghost"
          tone="neutral"
          size="sm"
          aria-current={current === index ? 'true' : undefined}
          className={current === index ? 'z-0' : 'z-[1]'}
          onClick={() => setCurrent(index)}
        >
          {current === index && (
            <Highlight
              id={id}
              axis="x"
              className="bg-surface absolute inset-0 -z-10 rounded-md shadow-sm"
            />
          )}
          {item}
        </Button>
      ))}
    </Inline>
  )
}
