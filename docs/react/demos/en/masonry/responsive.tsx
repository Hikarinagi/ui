'use client'

import { useState } from 'react'
import {
  Card,
  FormField,
  Masonry,
  Select,
  Stack,
  Switch,
  Text,
  Flex,
  type SelectValue,
} from '@hina-ui/react'
import { masonryNotes } from '../../masonry'

const items = masonryNotes('en')
const options = [
  { label: 'Automatic columns', value: 'auto' },
  { label: 'Two columns', value: '2' },
  { label: 'Three columns', value: '3' },
]

export default function Demo() {
  const [narrow, setNarrow] = useState(false)
  const [rtl, setRtl] = useState(false)
  const [columns, setColumns] = useState<SelectValue>('auto')

  return (
    <Stack className="w-full max-w-2xl">
      <Flex wrap gap="md" align="center">
        <Select
          value={columns}
          onValueChange={setColumns}
          options={options}
          aria-label="Columns"
          className="w-44"
        />
        <FormField label="Narrow container" orientation="horizontal">
          <Switch checked={narrow} onCheckedChange={setNarrow} />
        </FormField>
        <FormField label="RTL" orientation="horizontal">
          <Switch checked={rtl} onCheckedChange={setRtl} />
        </FormField>
      </Flex>
      <Masonry
        items={items}
        getKey={item => item.id}
        columns={columns === 'auto' ? undefined : Number(columns)}
        minColumnWidth={180}
        dir={rtl ? 'rtl' : 'ltr'}
        className={narrow ? 'mx-auto max-w-xs' : ''}
        label="Design notes"
      >
        {({ item, index }) => (
          <Card>
            <Stack gap="sm">
              <Text tone="accent" size="sm" weight="medium">
                {String(index + 1).padStart(2, '0')}
              </Text>
              <Text size="sm" weight="medium">
                {item.title}
              </Text>
              <Text size="sm" tone="muted">
                {item.body}
              </Text>
            </Stack>
          </Card>
        )}
      </Masonry>
    </Stack>
  )
}
