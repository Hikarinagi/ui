'use client'

import { useState } from 'react'
import { Checkbox } from '@hina-ui/react'

export default function Demo() {
  const [notify, setNotify] = useState<boolean | 'indeterminate'>(true)

  return (
    <Checkbox checked={notify} onCheckedChange={setNotify}>
      有新章节时通知我
    </Checkbox>
  )
}
