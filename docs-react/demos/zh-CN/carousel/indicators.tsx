'use client'

import { useState } from 'react'
import { Carousel, Image, Inline, Progress, SegmentedControl, Stack, Text } from '@hina-ui/react'
import { dataListDemo } from '../../../../docs/app/demos/data-list'

const items = dataListDemo('zh-CN').slice(0, 4)
const options = [
  { value: 'capsule', label: '默认' },
  { value: 'thumbnails', label: '缩略图' },
  { value: 'progress', label: '进度条' },
]

export default function Demo() {
  const [mode, setMode] = useState<string | number>('thumbnails')
  const [index, setIndex] = useState(0)

  return (
    <Stack className="w-full max-w-lg" data-demo-carousel-indicators="">
      <SegmentedControl
        value={mode}
        onValueChange={setMode}
        options={options}
        aria-label="指示器样式"
        size="sm"
        className="self-center"
      />
      <Carousel
        index={index}
        onIndexChange={setIndex}
        items={items}
        getKey={item => item.id}
        indicators
        label="自定义封面画廊"
        renderIndicator={
          mode === 'thumbnails'
            ? ({ index: position, active }) => (
                <Image
                  src={items[position]!.cover.src}
                  alt=""
                  ratio={3 / 4}
                  lazy={false}
                  draggable={false}
                  className={`w-8 rounded-sm transition-opacity duration-(--hn-duration-base) motion-reduce:transition-none ${active ? 'opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-surface' : 'opacity-50'}`}
                />
              )
            : undefined
        }
        renderIndicators={
          mode === 'progress'
            ? ({ index: position, snapCount }) => (
                <Inline gap="sm" wrap={false} className="w-36">
                  <Progress
                    value={position + 1}
                    max={Math.max(1, snapCount)}
                    size="sm"
                    aria-label="画廊进度"
                    className="flex-1"
                  />
                  <Text size="xs" tone="muted" dir="ltr" className="shrink-0 tabular-nums">
                    {position + 1} / {snapCount}
                  </Text>
                </Inline>
              )
            : undefined
        }
      >
        {({ item }) => (
          <Image
            src={item.cover.src}
            alt={item.title}
            ratio={16 / 10}
            draggable={false}
            className="rounded-xl"
          />
        )}
      </Carousel>
    </Stack>
  )
}
