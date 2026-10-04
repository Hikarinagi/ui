import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@hina-ui/react'

const specs = [
  { key: '发行方式', value: 'DL 版 / 实体版' },
  { key: '游戏时长', value: '约 20 小时' },
  { key: '语言', value: '日文 / 简体中文' },
]

export default function Demo() {
  return (
    <Table hover={false} className="w-full max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead>项目</TableHead>
          <TableHead>内容</TableHead>
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
