'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@hina-ui/react'

const options = [
  { value: 'mon', label: 'Mon' },
  { value: 'wed', label: 'Wed' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
]

export default function Demo() {
  const [days, setDays] = useState<Array<string | number>>(['sat', 'sun'])

  return (
    <CheckboxGroup
      value={days}
      onValueChange={setDays}
      options={options}
      orientation="horizontal"
      aria-label="Release days"
    />
  )
}
