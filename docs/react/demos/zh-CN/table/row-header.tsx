import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const rows = [
  { platform: 'Windows', release: '2020-06-19', price: '3,278 円' },
  { platform: 'Nintendo Switch', release: '2022-03-24', price: '4,180 円' },
  { platform: 'PlayStation 4', release: '2022-03-24', price: '4,180 円' },
]

export default function Demo() {
  return (
    <Table className="w-full max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>平台</TableHead>
          <TableHead>发售日</TableHead>
          <TableHead align="end">定价</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.platform}>
            <TableHead scope="row">{row.platform}</TableHead>
            <TableCell>{row.release}</TableCell>
            <TableCell align="end">{row.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
