'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@hina-ui/react'

const options = [
  { value: 'mon', label: '周一' },
  { value: 'wed', label: '周三' },
  { value: 'fri', label: '周五' },
  { value: 'sat', label: '周六' },
  { value: 'sun', label: '周日' },
]

export default function Demo() {
  const [days, setDays] = useState<Array<string | number>>(['sat', 'sun'])

  return (
    <CheckboxGroup
      value={days}
      onValueChange={setDays}
      options={options}
      orientation="horizontal"
      aria-label="更新日"
    />
  )
}
