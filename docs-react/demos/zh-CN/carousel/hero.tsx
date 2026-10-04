'use client'

import { useState } from 'react'
import { Carousel, Card, Image, Link, Stack, Text } from '@hina-ui/react'
import { dataListDemo } from '../../../../docs/app/demos/data-list'

const items = dataListDemo('zh-CN').slice(0, 5)

export default function Demo() {
  const [index, setIndex] = useState(0)

  return (
    <Carousel
      index={index}
      onIndexChange={setIndex}
      items={items}
      getKey={item => item.id}
      label="精选视觉小说"
      indicators
      className="max-w-2xl"
    >
      {({ item }) => (
        <Card
          padded={false}
          className="grid h-full grid-cols-1 overflow-hidden shadow-none @min-[480px]/hn-carousel:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
        >
          <Image
            src={item.cover.src}
            alt={item.title}
            draggable={false}
            className="aspect-[4/3] @min-[480px]/hn-carousel:aspect-[3/4]"
            imageClass="absolute inset-0"
          />
          <Stack
            gap="sm"
            justify="center"
            className="min-w-0 px-4 py-5 @min-[480px]/hn-carousel:px-8"
          >
            <Text as="h3" size="lg" weight="medium" className="line-clamp-2">
              {item.title}
            </Text>
            <Text size="sm" tone="muted" className="line-clamp-2">
              {item.developer}
            </Text>
            <Text as="time" dateTime={item.released} size="xs" tone="muted">
              {item.released}
            </Text>
            <Link
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-fit text-sm"
            >
              查看作品
            </Link>
          </Stack>
        </Card>
      )}
    </Carousel>
  )
}
