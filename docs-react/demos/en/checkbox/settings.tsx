'use client'

import { useState } from 'react'
import { Checkbox } from '@hina-ui/react'

export default function Demo() {
  const [weekly, setWeekly] = useState<boolean | 'indeterminate'>(true)

  return (
    <Checkbox
      checked={weekly}
      onCheckedChange={setWeekly}
      controlPlacement="end"
      block
      description="A digest of the week's updates every Monday. Unsubscribe any time."
    >
      Weekly newsletter
    </Checkbox>
  )
}
