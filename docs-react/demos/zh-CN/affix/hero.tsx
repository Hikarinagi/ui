'use client'

import { useState } from 'react'
import {
  Affix,
  Card,
  Checkbox,
  Inline,
  NumberInput,
  ScrollArea,
  Stack,
  Switch,
  Tag,
  Text,
} from '@hina-ui/react'
import { affixChecklist } from '../../../../docs/app/demos/affix'

const items = affixChecklist('zh-CN')

export default function Demo() {
  const [disabled, setDisabled] = useState(false)
  const [offset, setOffset] = useState<number | undefined>(12)
  const [checked, setChecked] = useState<boolean[]>(Array(6).fill(false))
  const completed = checked.filter(Boolean).length
  return (
    <Stack className="w-full max-w-xl">
      <Inline align="center" gap="lg" wrap>
        <Switch checked={disabled} onCheckedChange={setDisabled}>
          禁用吸附
        </Switch>
        <Inline align="center" gap="sm">
          <Text size="sm" tone="muted">
            顶部偏移
          </Text>
          <NumberInput
            value={offset}
            onValueChange={setOffset}
            min={0}
            max={40}
            step={4}
            size="sm"
            aria-label="顶部偏移（px）"
            className="w-28"
          />
        </Inline>
      </Inline>
      <Card padded={false}>
        <ScrollArea className="h-80" shadow={false} focusable label="发布前检查清单">
          <Stack className="p-4" gap="lg">
            <Text size="sm" tone="muted">
              向下滚动检查清单。工具栏到达指定偏移后会停住，勾选进度始终可见。
            </Text>
            <Affix offset={offset} disabled={disabled}>
              {({ affixed }) => (
                <Card className={`p-3 ${affixed ? 'shadow-md' : 'shadow-none'}`}>
                  <Inline align="center" justify="between" gap="sm" wrap>
                    <Text size="sm" weight="medium">
                      发布前检查 · {completed}/6
                    </Text>
                    <Tag size="sm" tone={affixed ? 'accent' : 'neutral'}>
                      {affixed ? '已吸附' : '随内容滚动'}
                    </Tag>
                  </Inline>
                </Card>
              )}
            </Affix>
            {items.map((item, index) => (
              <Checkbox
                key={item.title}
                checked={checked[index]}
                onCheckedChange={value =>
                  setChecked(checked =>
                    checked.map((item, i) => (i === index ? value === true : item)),
                  )
                }
                description={item.description}
                block
              >
                {item.title}
              </Checkbox>
            ))}
            <Text size="xs" tone="muted">
              吸附不会移动或重建工具栏里的控件。
            </Text>
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  )
}
