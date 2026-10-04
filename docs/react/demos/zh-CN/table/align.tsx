import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const volumes = [
  { name: '第一卷', chapters: 12, rating: '8.6' },
  { name: '第二卷', chapters: 9, rating: '9.1' },
  { name: '第三卷', chapters: 14, rating: '8.8' },
]

export default function Demo() {
  return (
    <Table className="w-full max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>卷次</TableHead>
          <TableHead align="center">章节数</TableHead>
          <TableHead align="end">评分</TableHead>
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
