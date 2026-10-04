'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, DataList, Empty, Switch, Text } from '@hina-ui/react'
import type { DataListDemoItem } from '../../../../docs/app/demos/data-list'

export default function Demo() {
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<DataListDemoItem[]>([])
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(true)
  const [knownTotal, setKnownTotal] = useState(true)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [failed, setFailed] = useState(false)
  const controller = useRef<AbortController>(undefined)

  const load = useCallback(async (target: number) => {
    controller.current?.abort()
    const request = new AbortController()
    controller.current = request
    setLoading(true)
    setFailed(false)
    try {
      const response = await fetch(`/demo/data-list/page-${target}.json`, {
        signal: request.signal,
      })
      if (!response.ok) throw new Error(String(response.status))
      const data = (await response.json()) as {
        items: Omit<DataListDemoItem, 'subtitle'>[]
        total: number
        hasNextPage: boolean
      }
      if (request.signal.aborted) return
      setRows(
        data.items.map(item => ({
          ...item,
          title: item.originalTitle,
          subtitle: item.title === item.originalTitle ? '' : item.title,
        })),
      )
      setTotal(data.total)
      setHasNextPage(data.hasNextPage)
    } catch {
      if (!request.signal.aborted) {
        setRows([])
        setFailed(true)
      }
    } finally {
      if (!request.signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(page)
  }, [load, page])

  useEffect(() => () => controller.current?.abort(), [])

  return (
    <DataList
      page={page}
      onPageChange={setPage}
      items={rows}
      itemKey="id"
      itemTitle="title"
      itemDescription="subtitle"
      pagination
      manual
      pageSize={10}
      total={knownTotal ? total : undefined}
      hasNextPage={hasNextPage}
      loading={loading}
      minHeight={400}
      className="max-w-2xl"
      label="Remote items"
      renderHeader={() => (
        <>
          <Switch checked={knownTotal} onCheckedChange={setKnownTotal} disabled={loading}>
            Known total
          </Switch>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            disabled={loading}
            onClick={() => void load(page)}
          >
            Refresh
          </Button>
        </>
      )}
      renderMeta={({ item }) => (
        <Text size="xs" tone="muted">
          {item.released}
        </Text>
      )}
      renderEmpty={() => (
        <Empty
          title={failed ? 'Loading failed' : 'No data'}
          size="sm"
          actions={
            failed ? (
              <Button size="sm" onClick={() => void load(page)}>
                Retry
              </Button>
            ) : undefined
          }
        />
      )}
    />
  )
}
