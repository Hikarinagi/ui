import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const episodes = Array.from({ length: 24 }, (_, index) => ({
  no: index + 1,
  title: `Episode ${index + 1}`,
  date: `2024-${String(Math.floor(index / 4) + 1).padStart(2, '0')}-15`,
}))

export default function Demo() {
  return (
    <Table stickyHeader className="max-h-72 w-full max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>Title</TableHead>
          <TableHead align="end">Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {episodes.map(episode => (
          <TableRow key={episode.no}>
            <TableCell>{episode.no}</TableCell>
            <TableCell>{episode.title}</TableCell>
            <TableCell align="end">{episode.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
