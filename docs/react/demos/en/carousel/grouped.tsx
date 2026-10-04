'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  FormField,
  IconButton,
  Image,
  Inline,
  Link,
  Slider,
  Stack,
  Switch,
  Text,
} from '@hina-ui/react'
import { dataListDemo } from '../../data-list'

const library = dataListDemo('en')
const items = [0, 3, 10, 5, 11, 6, 4, 8].map(index => library[index]!)

export default function Demo() {
  const [width, setWidth] = useState<number | undefined>(100)
  const [rtl, setRtl] = useState(false)

  return (
    <Stack className="w-full max-w-2xl" data-demo-carousel-grouped="">
      <Inline gap="lg" align="end">
        <FormField label="Container width" className="min-w-40 flex-1">
          <Slider
            value={width}
            onValueChange={setWidth}
            min={50}
            max={100}
            format={value => value + '%'}
          />
        </FormField>
        <Switch checked={rtl} onCheckedChange={setRtl} className="mb-1">
          Right-to-left
        </Switch>
      </Inline>
      <Text size="sm" tone="muted">
        Portrait, square and landscape covers keep their proportions. Resize the container to
        regroup them.
      </Text>
      <Carousel
        items={items}
        getKey={item => item.id}
        dir={rtl ? 'rtl' : 'ltr'}
        slidesToScroll="auto"
        itemClass="basis-auto"
        label="Browse the library"
        className="self-center"
        style={{ width: width + '%' }}
        renderControls={({ prev, next, canPrev, canNext, index, snapCount }) => (
          <Inline justify="between" className="w-full">
            <Text size="sm" tone="muted" dir="ltr">
              {snapCount ? `${index + 1} / ${snapCount}` : '—'}
            </Text>
            <Inline gap="xs">
              <IconButton label="Previous group" disabled={!canPrev} onClick={prev}>
                <ChevronLeft className="rtl:rotate-180" />
              </IconButton>
              <IconButton label="Next group" disabled={!canNext} onClick={next}>
                <ChevronRight className="rtl:rotate-180" />
              </IconButton>
            </Inline>
          </Inline>
        )}
      >
        {({ item }) => (
          <Stack
            gap="sm"
            className="h-full"
            style={{ width: `min(${(192 * item.cover.width) / item.cover.height}px, 100cqw)` }}
          >
            <Image
              src={item.cover.src}
              alt={item.title}
              ratio={item.cover.width / item.cover.height}
              draggable={false}
              className="rounded-lg"
            />
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              tone="neutral"
              className="line-clamp-2 w-fit max-w-full text-sm"
            >
              {item.title}
            </Link>
            <Text size="xs" tone="muted" truncate>
              {item.developer}
            </Text>
          </Stack>
        )}
      </Carousel>
    </Stack>
  )
}
