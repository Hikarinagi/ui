import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@hina-ui/react'

const rows = [
  { name: '夏目 佳月', cv: '藤咲ウサ' },
  { name: '斑鳩 千鹤', cv: '御苑生メイ' },
]

export default function Demo() {
  return (
    <Stack gap="lg" className="w-full max-w-lg">
      <Stack gap="sm">
        <Text size="sm" tone="faint">
          primary
        </Text>
        <Table variant="primary">
          <TableHeader>
            <TableRow>
              <TableHead>Character</TableHead>
              <TableHead>Voice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.cv}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      <Stack gap="sm">
        <Text size="sm" tone="faint">
          secondary
        </Text>
        <Table variant="secondary">
          <TableHeader>
            <TableRow>
              <TableHead>Character</TableHead>
              <TableHead>Voice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.cv}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Stack>
  )
}
