import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const volumes = [
  { name: 'Volume 1', chapters: 12, rating: '8.6' },
  { name: 'Volume 2', chapters: 9, rating: '9.1' },
  { name: 'Volume 3', chapters: 14, rating: '8.8' },
]

export default function Demo() {
  return (
    <Table className="w-full max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Volume</TableHead>
          <TableHead align="center">Chapters</TableHead>
          <TableHead align="end">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {volumes.map(volume => (
          <TableRow key={volume.name}>
            <TableCell>{volume.name}</TableCell>
            <TableCell align="center">{volume.chapters}</TableCell>
            <TableCell align="end">{volume.rating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
