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

const items = affixChecklist('en')

export default function Demo() {
  const [disabled, setDisabled] = useState(false)
  const [offset, setOffset] = useState<number | undefined>(12)
  const [checked, setChecked] = useState<boolean[]>(Array(6).fill(false))
  const completed = checked.filter(Boolean).length
  return (
    <Stack className="w-full max-w-xl">
      <Inline align="center" gap="lg" wrap>
        <Switch checked={disabled} onCheckedChange={setDisabled}>
          Disable affixing
        </Switch>
        <Inline align="center" gap="sm">
          <Text size="sm" tone="muted">
            Top offset
          </Text>
          <NumberInput
            value={offset}
            onValueChange={setOffset}
            min={0}
            max={40}
            step={4}
            size="sm"
            aria-label="Top offset in pixels"
            className="w-28"
          />
        </Inline>
      </Inline>
      <Card padded={false}>
        <ScrollArea className="h-80" shadow={false} focusable label="Release checklist">
          <Stack className="p-4" gap="lg">
            <Text size="sm" tone="muted">
              Scroll through the checklist. The toolbar stops at the chosen offset so your progress
              stays visible.
            </Text>
            <Affix offset={offset} disabled={disabled}>
              {({ affixed }) => (
                <Card className={`p-3 ${affixed ? 'shadow-md' : 'shadow-none'}`}>
                  <Inline align="center" justify="between" gap="sm" wrap>
                    <Text size="sm" weight="medium">
                      Release checks · {completed}/6
                    </Text>
                    <Tag size="sm" tone={affixed ? 'accent' : 'neutral'}>
                      {affixed ? 'Affixed' : 'In flow'}
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
              Affixing never moves or remounts controls inside the toolbar.
            </Text>
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  )
}
