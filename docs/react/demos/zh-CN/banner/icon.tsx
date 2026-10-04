import { Sparkles } from 'lucide-react'
import { Banner } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner icon={<Sparkles className="size-4 shrink-0" />}>
      周年活动进行中，全站图书限时八折。
    </Banner>
  )
}
