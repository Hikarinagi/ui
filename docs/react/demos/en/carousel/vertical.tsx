'use client'

import { Carousel, Card, Image, Link, Stack, Text } from '@hina-ui/react'
import { dataListDemo } from '../../data-list'

const items = dataListDemo('en').slice(0, 6)

export default function Demo() {
  return (
    <Carousel
      items={items}
      getKey={item => item.id}
      orientation="vertical"
      viewportClass="h-72"
      itemClass="basis-1/2"
      label="Reading queue"
      className="max-w-lg"
    >
      {({ item }) => (
        <Card className="flex h-full items-center gap-4 shadow-none">
          <Image
            src={item.cover.src}
            alt=""
            ratio={3 / 4}
            draggable={false}
            className="w-16 shrink-0 rounded-md"
          />
          <Stack gap="xs" className="min-w-0">
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              tone="neutral"
              className="line-clamp-2 w-fit text-sm font-medium"
            >
              {item.title}
            </Link>
            <Text size="xs" tone="muted" truncate>
              {item.developer}
            </Text>
            <Text as="time" dateTime={item.released} size="xs" tone="muted">
              {item.released}
            </Text>
          </Stack>
        </Card>
      )}
    </Carousel>
  )
}
