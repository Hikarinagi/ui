'use client'

import { useEffect, useState } from 'react'
import { CommandPalette, Stack, Switch, type CommandItem } from '@hina-ui/react'

const books: CommandItem[] = [
  { id: 'spice', label: '狼与香辛料', description: '支仓冻砂' },
  { id: 'kino', label: '奇诺之旅', description: '时雨泽惠一' },
  { id: 'hyouka', label: '冰菓', description: '米泽穗信' },
  { id: 'book-girl', label: '文学少女', description: '野村美月' },
]

export default function Demo() {
  const [keyword, setKeyword] = useState('')
  const [offline, setOffline] = useState(false)
  const [items, setItems] = useState<CommandItem[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const query = keyword.trim()
    setFailed(false)
    if (!query) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setItems(offline ? [] : books.filter(book => book.label.includes(query)))
      setFailed(offline)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [keyword, offline])

  return (
    <Stack align="start" className="w-full max-w-sm">
      <Switch checked={offline} onCheckedChange={setOffline}>
        模拟服务不可用
      </Switch>
      <CommandPalette
        search={keyword}
        onSearchChange={setKeyword}
        inline
        ignoreFilter
        items={items}
        loading={loading}
        placeholder="试试「狼」或「少女」"
        loadingContent="正在搜索"
        renderEmpty={({ search }) =>
          failed
            ? '搜索服务暂时不可用'
            : search.trim()
              ? `没有找到「${search.trim()}」`
              : '输入书名搜索'
        }
      />
    </Stack>
  )
}
