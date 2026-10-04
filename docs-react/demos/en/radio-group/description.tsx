'use client'

import { useState } from 'react'
import { RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'public', label: 'Public', description: 'Anyone can see this post' },
  {
    value: 'friends',
    label: 'Friends only',
    description: 'Only people you follow back can see it',
  },
  { value: 'private', label: 'Only me', description: 'Only you can see it' },
]

export default function Demo() {
  const [visibility, setVisibility] = useState<string | number | null | undefined>('friends')

  return (
    <RadioGroup
      value={visibility}
      onValueChange={setVisibility}
      options={options}
      aria-label="Visibility"
    />
  )
}
