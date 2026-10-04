'use client'

import { useState } from 'react'
import { Tree, type TreeValue } from '@hina-ui/react'
import { nodes } from './data'

export default function Demo() {
  const [checked, setChecked] = useState<TreeValue[]>(['a-2-1'])

  return (
    <Tree
      value={checked}
      onValueChange={value => setChecked(value as TreeValue[])}
      multiple
      items={nodes}
      defaultExpanded={['a', 'a-2', 'b']}
      aria-label="树形勾选"
      className="w-80 max-w-full"
    />
  )
}
