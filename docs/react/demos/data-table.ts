'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DataTableColumn, DataTableEdit, DataTableQuery } from '@hina-ui/react'

export interface TableDemoRow {
  id: number
  name: string
  status: 'active' | 'draft' | 'archived'
  count: number
}

export function tableDemo(locale: 'zh-CN' | 'en') {
  const en = locale === 'en'
  const statusLabels = en
    ? { active: 'Active', draft: 'Draft', archived: 'Archived' }
    : { active: '已发布', draft: '草稿', archived: '已归档' }
  const columns: DataTableColumn<TableDemoRow>[] = [
    { key: 'name', label: en ? 'Name' : '名称', sortable: true },
    { key: 'status', label: en ? 'Status' : '状态', format: (_, row) => statusLabels[row.status] },
    { key: 'count', label: en ? 'Count' : '数量', align: 'end', sortable: true },
  ]
  const rows: TableDemoRow[] = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    name: `${en ? 'Entry' : '条目'} ${String.fromCharCode(65 + index)}`,
    status: index % 5 === 4 ? 'archived' : index % 3 === 1 ? 'draft' : 'active',
    count: (index * 37 + 18) % 150,
  }))
  return { rows, columns, statusLabels }
}

const initialQuery: DataTableQuery = {
  page: 1,
  pageSize: 5,
  sorting: [],
  filter: '',
  columnFilters: [],
  grouping: [],
}

export function useRemoteTableDemo(locale: 'zh-CN' | 'en') {
  const source = useMemo(() => tableDemo(locale), [locale])
  const [rows, setRows] = useState<TableDemoRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastQuery, setLastQuery] = useState<DataTableQuery>(initialQuery)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const load = useCallback(
    (query: DataTableQuery) => {
      clearTimeout(timer.current)
      setLoading(true)
      setLastQuery(query)
      timer.current = setTimeout(() => {
        const data = source.rows.filter(row =>
          row.name.toLowerCase().includes(query.filter.trim().toLowerCase()),
        )
        data.sort((a, b) => {
          for (const sort of query.sorting) {
            const column = source.columns.find(column => column.key === sort.key)
            if (!column) continue
            const left = a[sort.key as keyof TableDemoRow]
            const right = b[sort.key as keyof TableDemoRow]
            const order =
              typeof left === 'number' && typeof right === 'number'
                ? left - right
                : String(left).localeCompare(String(right), locale, { numeric: true })
            if (order) return sort.desc ? -order : order
          }
          return 0
        })
        setTotal(data.length)
        setRows(data.slice((query.page - 1) * query.pageSize, query.page * query.pageSize))
        setLoading(false)
      }, 450)
    },
    [source, locale],
  )
  useEffect(() => {
    load(initialQuery)
    return () => clearTimeout(timer.current)
  }, [load])
  return { ...source, rows, total, loading, lastQuery, load }
}

export function useEditableTableDemo(locale: 'zh-CN' | 'en') {
  const source = useMemo(() => tableDemo(locale), [locale])
  const [rows, setRows] = useState(() => source.rows.slice(0, 4))
  const [fail, setFail] = useState(false)
  const [mode, setMode] = useState<'cell' | 'row'>('cell')
  const failing = useRef(fail)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const finish = useRef<(() => void) | undefined>(undefined)
  const columns = useMemo<DataTableColumn<TableDemoRow>[]>(
    () =>
      source.columns.map(column => ({
        ...column,
        width: column.key === 'name' ? 260 : 200,
        editable: true,
        parse: column.key === 'count' ? Number : undefined,
        validate:
          column.key === 'count'
            ? value =>
                Number.isFinite(value) && Number(value) >= 0
                  ? undefined
                  : locale === 'en'
                    ? 'Enter a nonnegative number'
                    : '请输入非负数'
            : undefined,
      })),
    [source, locale],
  )
  useEffect(() => {
    failing.current = fail
  }, [fail])
  const save = useCallback(
    async (edit: DataTableEdit<TableDemoRow>) => {
      await new Promise<void>(resolve => {
        finish.current = resolve
        timer.current = setTimeout(resolve, 600)
      })
      if (failing.current)
        throw new Error(locale === 'en' ? 'Save failed. Try again.' : '保存失败，请重试。')
      setRows(rows => rows.map(row => (row.id === edit.key ? { ...row, ...edit.values } : row)))
    },
    [locale],
  )
  useEffect(
    () => () => {
      clearTimeout(timer.current)
      finish.current?.()
    },
    [],
  )
  return { ...source, rows, columns, fail, setFail, mode, setMode, save }
}

export function treeTableDemo(locale: 'zh-CN' | 'en') {
  const source = tableDemo(locale)
  type Node = TableDemoRow & { children?: Node[] }
  const rows: Node[] = source.rows
    .slice(0, 3)
    .map((row, index) => ({ ...row, children: source.rows.slice(3 + index * 2, 5 + index * 2) }))
  return { ...source, rows, getChildren: (row: Node) => row.children }
}
