'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画' },
]

export default function Demo() {
  const [types, setTypes] = useState<Array<string | number>>(['gal', 'ln'])

  return (
    <CheckboxGroup value={types} onValueChange={setTypes} options={options} aria-label="作品类型" />
  )
}
