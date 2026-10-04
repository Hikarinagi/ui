import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const specs = [
  { key: 'Format', value: 'Download / Physical' },
  { key: 'Length', value: 'About 20 hours' },
  { key: 'Language', value: 'Japanese / Simplified Chinese' },
]

export default function Demo() {
  return (
    <Table hover={false} className="w-full max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specs.map(spec => (
          <TableRow key={spec.key}>
            <TableCell>{spec.key}</TableCell>
            <TableCell>{spec.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
