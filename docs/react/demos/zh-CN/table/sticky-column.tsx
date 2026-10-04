import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const works = [
  {
    title: 'ATRI -My Dear Moments-',
    brand: 'ANIPLEX.EXE',
    date: '2020-06-19',
    platform: 'Windows',
    language: '日文 / 简体中文',
    length: '约 20 小时',
    rating: '8.9',
  },
  {
    title: 'Summer Pockets',
    brand: 'Key',
    date: '2018-06-29',
    platform: 'Windows',
    language: '日文',
    length: '约 40 小时',
    rating: '8.5',
  },
  {
    title: 'サクラノ詩',
    brand: '枕',
    date: '2015-10-23',
    platform: 'Windows',
    language: '日文',
    length: '约 50 小时',
    rating: '9.0',
  },
]

export default function Demo() {
  return (
    <Table className="w-full max-w-lg [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
      <TableHeader>
        <TableRow>
          <TableHead sticky>作品</TableHead>
          <TableHead>品牌</TableHead>
          <TableHead>发售日</TableHead>
          <TableHead>平台</TableHead>
          <TableHead>语言</TableHead>
          <TableHead>时长</TableHead>
          <TableHead align="end">评分</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {works.map(work => (
          <TableRow key={work.title}>
            <TableCell sticky>{work.title}</TableCell>
            <TableCell>{work.brand}</TableCell>
            <TableCell>{work.date}</TableCell>
            <TableCell>{work.platform}</TableCell>
            <TableCell>{work.language}</TableCell>
            <TableCell>{work.length}</TableCell>
            <TableCell align="end">{work.rating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
