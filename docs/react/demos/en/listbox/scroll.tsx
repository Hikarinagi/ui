'use client'

import { useState } from 'react'
import { Listbox, type ListboxValue } from '@hina-ui/react'

const years = Array.from({ length: 30 }, (_, i) => ({ value: 1996 + i, label: `` }))

export default function Demo() {
  const [year, setYear] = useState<ListboxValue>(2020)

  return (
    <Listbox
      value={year}
      onValueChange={setYear}
      options={years}
      maxHeight="12rem"
      aria-label="Year"
      className="w-40"
    />
  )
}
