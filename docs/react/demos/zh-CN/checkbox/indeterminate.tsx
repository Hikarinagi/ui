'use client'

import { useState } from 'react'
import { Checkbox, Stack } from '@hina-ui/react'

const types = ['Galgame', '轻小说', '漫画']

export default function Demo() {
  const [picked, setPicked] = useState(['Galgame'])

  const all: boolean | 'indeterminate' =
    picked.length === 0 ? false : picked.length === types.length ? true : 'indeterminate'

  function setAll(value: boolean | 'indeterminate') {
    setPicked(value === true ? [...types] : [])
  }

  function toggle(type: string, on: boolean | 'indeterminate') {
    setPicked(on === true ? [...picked, type] : picked.filter(t => t !== type))
  }

  return (
    <Stack gap="sm">
      <Checkbox checked={all} onCheckedChange={setAll}>
        全部类型
      </Checkbox>
      <Stack gap="sm" className="ps-6">
        {types.map(type => (
          <Checkbox
            key={type}
            checked={picked.includes(type)}
            onCheckedChange={value => toggle(type, value)}
          >
            {type}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  )
}
