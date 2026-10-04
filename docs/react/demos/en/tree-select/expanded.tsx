'use client'

import { useState } from 'react'
import { TreeSelect, type TreeSelectValue } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  const [region, setRegion] = useState<TreeSelectValue>(null)

  return (
    <TreeSelect
      value={region}
      onValueChange={setRegion}
      items={regions}
      defaultExpanded={['jp', 'kanto']}
      placeholder="Choose a region"
      aria-label="Region"
      className="w-64"
    />
  )
}
