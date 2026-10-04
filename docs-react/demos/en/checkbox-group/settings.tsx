'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@hina-ui/react'

const options = [
  { value: 'read', label: 'Read', description: 'View your library and reading progress' },
  { value: 'write', label: 'Write', description: 'Change your library and ratings' },
  { value: 'admin', label: 'Manage', description: 'Manage tokens and granted scopes' },
]

export default function Demo() {
  const [scopes, setScopes] = useState<Array<string | number>>(['read'])

  return (
    <CheckboxGroup
      value={scopes}
      onValueChange={setScopes}
      controlPlacement="end"
      block
      options={options}
      aria-label="Scopes"
    />
  )
}
