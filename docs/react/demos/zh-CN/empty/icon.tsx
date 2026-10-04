import { SearchX } from 'lucide-react'
import { Empty, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <Empty
        title="没有匹配的结果"
        description="换个关键词试试。"
        className="w-72"
        icon={<SearchX className="text-muted size-8" />}
      />
      <Empty title="没有匹配的结果" description="换个关键词试试。" icon={false} className="w-72" />
    </Inline>
  )
}
