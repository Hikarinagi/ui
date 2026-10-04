'use client'

import { Card, Image, ImageGroup, Masonry, Skeleton, Stack, Text } from '@hina-ui/react'
import { masonryGallery } from '../../../../docs/app/demos/masonry'

const items = masonryGallery('en')

export default function Demo() {
  return (
    <Stack className="w-full max-w-2xl" gap="sm">
      <Text size="sm" tone="muted">
        Covers in their original proportions. Select an image to preview it.
      </Text>
      <ImageGroup>
        <Masonry
          items={items}
          getKey={item => item.id}
          minColumnWidth={160}
          gap="lg"
          label="Cover gallery"
          pending={
            <Stack aria-hidden="true" className="block columns-[160px] gap-[var(--hn-masonry-gap)]">
              {items.map(item => (
                <Card
                  key={item.id}
                  padded={false}
                  className="mb-[var(--hn-masonry-row-gap)] break-inside-avoid"
                >
                  <Skeleton
                    className="w-full"
                    style={{ aspectRatio: item.cover.width / item.cover.height }}
                  />
                  <Stack className="p-3" gap="sm">
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </Stack>
                </Card>
              ))}
            </Stack>
          }
        >
          {({ item }) => (
            <Card padded={false}>
              <Image
                src={item.cover.src}
                alt={item.title}
                ratio={item.cover.width / item.cover.height}
                previewSize={item.cover}
                preview
                className="w-full rounded-t-xl"
              />
              <Stack className="p-3" gap="xs">
                <Text size="sm" weight="medium">
                  {item.title}
                </Text>
                <Text as="time" dateTime={item.released} size="xs" tone="muted">
                  {item.released}
                </Text>
              </Stack>
            </Card>
          )}
        </Masonry>
      </ImageGroup>
    </Stack>
  )
}
