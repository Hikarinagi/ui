import { SearchX } from 'lucide-react'
import { Empty, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <Empty
        title="No matches"
        description="Try another keyword."
        className="w-72"
        icon={<SearchX className="text-muted size-8" />}
      />
      <Empty title="No matches" description="Try another keyword." icon={false} className="w-72" />
    </Inline>
  )
}
