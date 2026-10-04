'use client'

import { useRef, useState } from 'react'
import {
  Button,
  Card,
  FormField,
  ScrollArea,
  ScrollTop,
  Stack,
  Switch,
  Text,
  type ScrollAreaHandle,
} from '@hina-ui/react'

export default function Demo() {
  const area = useRef<ScrollAreaHandle>(null)
  const [show, setShow] = useState(true)

  return (
    <Stack className="w-full max-w-md" gap="sm">
      <FormField label="挂载滚动区域" orientation="horizontal">
        <Switch checked={show} onCheckedChange={setShow} />
      </FormField>
      <Button
        variant="outline"
        tone="neutral"
        className="self-start"
        disabled={!show}
        onClick={() => area.current?.viewport?.scrollTo({ top: 500, behavior: 'instant' })}
      >
        滚动到中段
      </Button>
      <Card padded={false} className="relative h-64 overflow-hidden">
        {show ? (
          <ScrollArea ref={area} className="h-full" shadow={false} focusable label="审阅记录">
            <Stack className="p-5 pb-24" gap="lg">
              {Array.from({ length: 20 }, (_, i) => i + 1).map(i => (
                <Text key={i} size="sm" className="border-line border-b pb-3">
                  审阅记录 {i} · 检查交互与视觉细节
                </Text>
              ))}
            </Stack>
          </ScrollArea>
        ) : (
          <Text size="sm" tone="muted" className="p-5">
            滚动区域已卸载
          </Text>
        )}
        <ScrollTop
          target={() => area.current?.viewport}
          position="absolute"
          threshold={120}
          offset={16}
        />
      </Card>
      <Text size="sm" tone="muted">
        回顶组件保持挂载。目标尚未准备好或已卸载时，按钮隐藏，也不会改为滚动页面。
      </Text>
    </Stack>
  )
}
