'use client'

import { useState } from 'react'
import { TreeSelect, type TreeSelectValue } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  const [region, setRegion] = useState<TreeSelectValue>('kyoto')

  return (
    <TreeSelect
      value={region}
      onValueChange={setRegion}
      items={regions}
      aria-label="地区"
      className="w-64"
    />
  )
}
