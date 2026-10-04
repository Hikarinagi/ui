'use client'

import { useRef, useState } from 'react'
import { ChevronsUp } from 'lucide-react'
import {
  Button,
  Card,
  FormField,
  Heading,
  ScrollArea,
  ScrollTop,
  Stack,
  Switch,
  Text,
  type ScrollAreaHandle,
} from '@hina-ui/react'

export default function Demo() {
  const area = useRef<ScrollAreaHandle>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const [instant, setInstant] = useState(false)
  function goDown() {
    area.current?.viewport?.scrollTo({ top: 450, behavior: 'instant' })
  }

  return (
    <Stack className="w-full max-w-md" gap="sm">
      <FormField label="立即回顶" orientation="horizontal">
        <Switch checked={instant} onCheckedChange={setInstant} />
      </FormField>
      <Button variant="outline" tone="neutral" className="self-start" onClick={goDown}>
        滚动到中段
      </Button>
      <Card padded={false} className="relative overflow-hidden">
        <ScrollArea ref={area} className="h-64" shadow={false} focusable label="发布检查项">
          <Stack className="p-5 pb-24" gap="lg">
            <Heading
              ref={heading}
              level={3}
              size="base"
              tabIndex={-1}
              className="hn-focus-ring rounded-sm"
            >
              发布检查项
            </Heading>
            {[
              '验证核心流程',
              '检查空状态',
              '检查加载和重试',
              '检查键盘操作',
              '检查表单错误',
              '检查移动端排版',
              '检查深色模式',
              '检查 RTL',
              '检查服务端渲染',
              '核对文档示例',
              '补齐变更记录',
              '确认发布版本',
            ].map(item => (
              <Text key={item} size="sm" className="border-line border-b pb-3">
                {item}
              </Text>
            ))}
          </Stack>
        </ScrollArea>
        <ScrollTop
          target={() => area.current?.viewport}
          focusTarget={() => heading.current}
          threshold={80}
          behavior={instant ? 'instant' : 'smooth'}
          position="absolute"
          offset={16}
          extended
          size="sm"
          shape="square"
          variant="soft"
          tone="accent"
          label="返回检查项开头"
        >
          <ChevronsUp />
        </ScrollTop>
      </Card>
      <Text size="sm" tone="muted">
        回顶后将焦点移到标题，可以从这里继续键盘浏览。
      </Text>
    </Stack>
  )
}
