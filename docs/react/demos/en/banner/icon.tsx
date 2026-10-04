import { Sparkles } from 'lucide-react'
import { Banner } from '@hina-ui/react'

export default function Demo() {
  return (
    <Banner icon={<Sparkles className="size-4 shrink-0" />}>
      Anniversary sale: 20% off every book for a limited time.
    </Banner>
  )
}
