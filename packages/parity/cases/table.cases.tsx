import { h } from 'vue'
import VTable from '@hina-ui/vue/components/table/Table.vue'
import VTableHeader from '@hina-ui/vue/components/table/TableHeader.vue'
import VTableBody from '@hina-ui/vue/components/table/TableBody.vue'
import VTableRow from '@hina-ui/vue/components/table/TableRow.vue'
import VTableHead from '@hina-ui/vue/components/table/TableHead.vue'
import VTableCell from '@hina-ui/vue/components/table/TableCell.vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { Table } from '@hina-ui/react/components/table/Table'
import { TableHeader } from '@hina-ui/react/components/table/TableHeader'
import { TableBody } from '@hina-ui/react/components/table/TableBody'
import { TableRow } from '@hina-ui/react/components/table/TableRow'
import { TableHead } from '@hina-ui/react/components/table/TableHead'
import { TableCell } from '@hina-ui/react/components/table/TableCell'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

type Align = 'start' | 'center' | 'end'

interface Column {
  label: string
  align?: Align
  sticky?: boolean
}

interface Spec {
  props?: Record<string, unknown>
  columns: Column[]
  rows: string[][]
  rowHeader?: boolean
  cellClass?: string
}

function vueTable(spec: Spec) {
  return h(VTable, spec.props ?? {}, () => [
    h(VTableHeader, () => [
      h(VTableRow, () =>
        spec.columns.map(column =>
          h(VTableHead, { align: column.align, sticky: column.sticky }, () => column.label),
        ),
      ),
    ]),
    h(VTableBody, () =>
      spec.rows.map(row =>
        h(VTableRow, { key: row[0] }, () =>
          row.map((cell, index) =>
            spec.rowHeader && index === 0
              ? h(VTableHead, { scope: 'row' }, () => cell)
              : h(
                  VTableCell,
                  {
                    align: spec.columns[index]!.align,
                    sticky: spec.columns[index]!.sticky,
                    class: spec.cellClass,
                  },
                  () => cell,
                ),
          ),
        ),
      ),
    ),
  ])
}

function reactTable(spec: Spec) {
  const { className, ...props } = (spec.props ?? {}) as { className?: string }
  return (
    <Table {...props} className={className}>
      <TableHeader>
        <TableRow>
          {spec.columns.map(column => (
            <TableHead key={column.label} align={column.align} sticky={column.sticky}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {spec.rows.map(row => (
          <TableRow key={row[0]}>
            {row.map((cell, index) =>
              spec.rowHeader && index === 0 ? (
                <TableHead key={index} scope="row">
                  {cell}
                </TableHead>
              ) : (
                <TableCell
                  key={index}
                  align={spec.columns[index]!.align}
                  sticky={spec.columns[index]!.sticky}
                  className={spec.cellClass}
                >
                  {cell}
                </TableCell>
              ),
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function both(name: string, spec: Spec, vueClass?: string) {
  const vueSpec = { ...spec, props: { ...spec.props, class: vueClass } }
  delete (vueSpec.props as Record<string, unknown>).className
  return { name, vue: () => vueTable(vueSpec), react: () => reactTable(spec) }
}

const volumes = [
  ['第一卷', '328', '2021-03-10'],
  ['第二卷', '304', '2021-09-10'],
  ['第三卷', '352', '2022-02-10'],
]

const unitRows = [
  ['variant', 'solid | soft | outline | ghost | link', 'solid'],
  ['size', 'sm | md | lg', 'md'],
]

const works = [
  [
    'ATRI -My Dear Moments-',
    'ANIPLEX.EXE',
    '2020-06-19',
    'Windows',
    '日文 / 简体中文',
    '约 20 小时',
    '8.9',
  ],
  ['Summer Pockets', 'Key', '2018-06-29', 'Windows', '日文', '约 40 小时', '8.5'],
]

const episodes = Array.from({ length: 6 }, (_, index) => [
  String(index + 1),
  `第 ${index + 1} 话`,
  `2024-0${Math.floor(index / 4) + 1}-15`,
])

export default defineCases('Table', [
  both(
    'basic demo',
    {
      props: { className: 'w-full max-w-lg' },
      columns: [{ label: '卷次' }, { label: '页数' }, { label: '发售日' }],
      rows: volumes,
    },
    'w-full max-w-lg',
  ),
  both('unit harness with caption and end alignment', {
    props: { caption: 'Button 的属性' },
    columns: [{ label: '属性' }, { label: '类型' }, { label: '默认值', align: 'end' }],
    rows: unitRows,
  }),
  both(
    'align start center end',
    {
      props: { className: 'w-full max-w-lg' },
      columns: [
        { label: '卷次' },
        { label: '章节数', align: 'center' },
        { label: '评分', align: 'end' },
      ],
      rows: [
        ['第一卷', '12', '8.6'],
        ['第二卷', '9', '9.1'],
      ],
    },
    'w-full max-w-lg',
  ),
  both('explicit start alignment', {
    columns: [
      { label: 'start', align: 'start' },
      { label: 'center', align: 'center' },
      { label: 'end', align: 'end' },
    ],
    rows: [['start', 'center', 'end']],
  }),
  both(
    'caption demo',
    {
      props: { caption: '单行本发售一览', className: 'w-full max-w-lg' },
      columns: [{ label: '卷次' }, { label: '发售日' }],
      rows: [
        ['第一卷', '2021-03-10'],
        ['第二卷', '2021-09-10'],
      ],
    },
    'w-full max-w-lg',
  ),
  both(
    'hover false',
    {
      props: { hover: false, className: 'w-full max-w-lg' },
      columns: [{ label: '项目' }, { label: '内容' }],
      rows: [
        ['发行方式', 'DL 版 / 实体版'],
        ['游戏时长', '约 20 小时'],
      ],
    },
    'w-full max-w-lg',
  ),
  both(
    'row header scope',
    {
      props: { className: 'w-full max-w-xl' },
      columns: [{ label: '平台' }, { label: '发售日' }, { label: '定价', align: 'end' }],
      rows: [
        ['Windows', '2020-06-19', '3,278 円'],
        ['Nintendo Switch', '2022-03-24', '4,180 円'],
      ],
      rowHeader: true,
    },
    'w-full max-w-xl',
  ),
  both(
    'sticky column head and cells',
    {
      props: { className: 'w-full max-w-lg [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap' },
      columns: [
        { label: '作品', sticky: true },
        { label: '品牌' },
        { label: '发售日' },
        { label: '平台' },
        { label: '语言' },
        { label: '时长' },
        { label: '评分', align: 'end' },
      ],
      rows: works,
    },
    'w-full max-w-lg [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap',
  ),
  both(
    'sticky header scrolls both axes',
    {
      props: { stickyHeader: true, className: 'max-h-72 w-full max-w-lg' },
      columns: [{ label: '话数' }, { label: '标题' }, { label: '更新日', align: 'end' }],
      rows: episodes,
    },
    'max-h-72 w-full max-w-lg',
  ),
  ...(['primary', 'secondary'] as const).map(variant =>
    both(`variant ${variant}`, {
      props: { variant },
      columns: [{ label: '角色' }, { label: '声优' }],
      rows: [
        ['夏目 佳月', '藤咲ウサ'],
        ['斑鳩 千鹤', '御苑生メイ'],
      ],
    }),
  ),
  both('cell class merges with variants', {
    columns: [{ label: '列' }],
    rows: [['很宽很宽的单元格内容']],
    cellClass: 'whitespace-nowrap min-w-36',
  }),
  {
    name: 'density demo wrapper',
    vue: () =>
      h(VStack, { gap: 'sm', 'data-density': 'compact' }, () => [
        h(VText, { size: 'sm', tone: 'faint' }, () => 'compact'),
        vueTable({
          columns: [{ label: '卷次' }, { label: '发售日', align: 'end' }],
          rows: [['第一卷', '2021-03-10']],
        }),
      ]),
    react: () => (
      <Stack gap="sm" data-density="compact">
        <Text size="sm" tone="faint">
          compact
        </Text>
        {reactTable({
          columns: [{ label: '卷次' }, { label: '发售日', align: 'end' }],
          rows: [['第一卷', '2021-03-10']],
        })}
      </Stack>
    ),
  },
  {
    name: 'parts forward attributes and classes',
    vue: () =>
      h(VTable, { id: 'tbl', 'data-x': '1', style: 'margin-top: 4px' }, () => [
        h(VTableHeader, { class: 'head-x', 'data-part': 'thead' }, () =>
          h(VTableRow, { class: 'row-x' }, () =>
            h(VTableHead, { class: 'th-x', colspan: 2 }, () => '合并'),
          ),
        ),
        h(VTableBody, { class: 'body-x' }, () =>
          h(VTableRow, { 'data-row': 'a' }, () => [
            h(VTableCell, { class: 'td-x', colspan: 1 }, () => 'a'),
            h(VTableCell, { align: 'center', sticky: true }, () => 'b'),
          ]),
        ),
      ]),
    react: () => (
      <Table id="tbl" data-x="1" style={{ marginTop: '4px' }}>
        <TableHeader className="head-x" data-part="thead">
          <TableRow className="row-x">
            <TableHead className="th-x" colSpan={2}>
              合并
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="body-x">
          <TableRow data-row="a">
            <TableCell className="td-x" colSpan={1}>
              a
            </TableCell>
            <TableCell align="center" sticky>
              b
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
])
