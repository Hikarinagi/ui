'use client'

import { useState } from 'react'
import { Anchor, Heading, Inline, ScrollArea, Section, Stack, Switch, Text } from '@hina-ui/react'

const topics = ['背景与目标', '设计过程', '实现细节', '使用体验', '总结与展望']
const items = Array.from({ length: 51 }, (_, index) => ({
  id: `long-toc-${index + 1}`,
  label: `第 ${index + 1} 节 · ${topics[index % topics.length]}`,
}))

export default function Demo() {
  const [autoScroll, setAutoScroll] = useState(true)
  const [current, setCurrent] = useState<string>()
  const currentLabel = items.find(item => item.id === current)?.label

  return (
    <Stack className="w-full max-w-2xl">
      <Inline justify="between">
        <Switch checked={autoScroll} onCheckedChange={setAutoScroll}>
          目录自动跟随
        </Switch>
        <Text size="sm" tone="muted">
          共 51 节
        </Text>
      </Inline>
      <Inline align="start" gap="md" wrap={false}>
        <ScrollArea
          className="border-line h-80 min-w-0 flex-1 rounded-lg border"
          focusable
          label="文章正文"
        >
          {items.map(item => (
            <Section id={item.id} key={item.id} className="min-h-56 p-4">
              <Heading level={3} size="sm">
                {item.label}
              </Heading>
              <Text size="sm" tone="muted">
                滚动正文阅读后续小节，目录会让当前项保持可见。也可以独立滚动目录，查找其他章节。
              </Text>
            </Section>
          ))}
        </ScrollArea>
        <ScrollArea
          className="h-80 w-2/5 max-w-48 shrink-0"
          shadow={false}
          focusable
          label="文章目录滚动区域"
        >
          <Anchor
            items={items}
            autoScroll={autoScroll}
            label="长篇文章目录"
            onChange={setCurrent}
          />
        </ScrollArea>
      </Inline>
      <Text size="sm" tone="muted">
        当前：{currentLabel ?? '尚未进入正文'}
      </Text>
    </Stack>
  )
}
