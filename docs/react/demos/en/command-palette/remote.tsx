'use client'

import { useEffect, useState } from 'react'
import { CommandPalette, Stack, Switch, type CommandItem } from '@hina-ui/react'

const books: CommandItem[] = [
  { id: 'spice', label: 'Spice and Wolf', description: 'Isuna Hasekura' },
  { id: 'kino', label: "Kino's Journey", description: 'Keiichi Sigsawa' },
  { id: 'hyouka', label: 'Hyouka', description: 'Honobu Yonezawa' },
  { id: 'book-girl', label: 'Book Girl', description: 'Mizuki Nomura' },
]

export default function Demo() {
  const [keyword, setKeyword] = useState('')
  const [offline, setOffline] = useState(false)
  const [items, setItems] = useState<CommandItem[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const query = keyword.trim().toLowerCase()
    setFailed(false)
    if (!query) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setItems(offline ? [] : books.filter(book => book.label.toLowerCase().includes(query)))
      setFailed(offline)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [keyword, offline])

  return (
    <Stack align="start" className="w-full max-w-sm">
      <Switch checked={offline} onCheckedChange={setOffline}>
        Simulate a service outage
      </Switch>
      <CommandPalette
        search={keyword}
        onSearchChange={setKeyword}
        inline
        ignoreFilter
        items={items}
        loading={loading}
        placeholder="Try wolf or girl"
        loadingContent="Searching"
        renderEmpty={({ search }) =>
          failed
            ? 'The search service is unavailable'
            : search.trim()
              ? `No results for "${search.trim()}"`
              : 'Type a title to search'
        }
      />
    </Stack>
  )
}
