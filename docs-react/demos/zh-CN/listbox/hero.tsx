'use client'

import { useState } from 'react'
import { Listbox, type ListboxValue } from '@hina-ui/react'

const statuses = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
  { value: 'done', label: '看过' },
  { value: 'dropped', label: '抛弃' },
]

export default function Demo() {
  const [status, setStatus] = useState<ListboxValue>('doing')

  return (
    <Listbox
      value={status}
      onValueChange={setStatus}
      options={statuses}
      aria-label="收藏状态"
      className="w-56"
    />
  )
}
