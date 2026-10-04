'use client'

import { useState } from 'react'
import {
  FormField,
  Inline,
  QRCode,
  SegmentedControl,
  Slider,
  Stack,
  Switch,
  Text,
  type QRCodeLevel,
} from '@hina-ui/react'

const levels = ['L', 'M', 'Q', 'H'].map(value => ({ value, label: value }))

export default function Demo() {
  const [size, setSize] = useState<number | undefined>(192)
  const [logo, setLogo] = useState(true)
  const [brand, setBrand] = useState(false)
  const [level, setLevel] = useState<QRCodeLevel>('H')

  return (
    <Stack align="center" className="w-full max-w-sm" data-demo-qr-appearance="">
      <QRCode
        value="https://hinaui.dev"
        size={size}
        level={level}
        logo={logo ? '/favicon.png' : undefined}
        color={brand ? 'var(--color-brand-800)' : undefined}
      />
      <Stack className="w-full">
        <FormField label="尺寸">
          <Inline wrap={false} gap="sm">
            <Slider
              value={size}
              onValueChange={setSize}
              min={128}
              max={256}
              step={8}
              className="flex-1"
            />
            <Text size="sm" tone="muted" className="w-14 shrink-0 tabular-nums">
              {size}px
            </Text>
          </Inline>
        </FormField>
        <FormField label="纠错等级">
          <SegmentedControl
            value={level}
            onValueChange={value => setLevel(value as QRCodeLevel)}
            options={levels}
            block
          />
        </FormField>
        <Inline justify="between">
          <Switch checked={logo} onCheckedChange={setLogo}>
            中心标志
          </Switch>
          <Switch checked={brand} onCheckedChange={setBrand}>
            品牌色
          </Switch>
        </Inline>
      </Stack>
    </Stack>
  )
}
