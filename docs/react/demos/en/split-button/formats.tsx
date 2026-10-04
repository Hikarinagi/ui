'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  SplitButton,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [format, setFormat] = useState('CSV')
  const [result, setResult] = useState('The primary action uses the selected format')

  return (
    <Stack align="center" gap="sm">
      <SplitButton
        variant="outline"
        menuLabel="Export format"
        icon={<Download />}
        onClick={() => setResult(`Action: export ${format}`)}
        renderContent={() => (
          <>
            <DropdownMenuLabel>File format</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={format} onValueChange={setFormat}>
              <DropdownMenuRadioItem value="CSV">CSV</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="JSON">JSON</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="XLSX">Excel (.xlsx)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      >
        {`Export ${format}`}
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
