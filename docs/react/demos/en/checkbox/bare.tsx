'use client'

import { useState } from 'react'
import { Checkbox, Inline } from '@hina-ui/react'

export default function Demo() {
  const [rows, setRows] = useState([true, false, false])

  return (
    <Inline gap="sm">
      {rows.map((row, index) => (
        <Checkbox
          key={index}
          checked={row}
          onCheckedChange={value =>
            setRows(rows.map((item, at) => (at === index ? value === true : item)))
          }
          aria-label={`Select row ${index + 1}`}
        />
      ))}
    </Inline>
  )
}
