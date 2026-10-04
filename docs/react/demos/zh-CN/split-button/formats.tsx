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
  const [result, setResult] = useState('选择格式后，主操作使用新的格式')

  return (
    <Stack align="center" gap="sm">
      <SplitButton
        variant="outline"
        menuLabel="导出格式"
        icon={<Download />}
        onClick={() => setResult(`已执行：导出 ${format}`)}
        renderContent={() => (
          <>
            <DropdownMenuLabel>文件格式</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={format} onValueChange={setFormat}>
              <DropdownMenuRadioItem value="CSV">CSV</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="JSON">JSON</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="XLSX">Excel (.xlsx)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      >
        {`导出 ${format}`}
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
