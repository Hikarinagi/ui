import { Sparkles } from 'lucide-react'
import { Alert } from '@hina-ui/react'

export default function Demo() {
  return (
    <Alert
      tone="accent"
      className="w-full max-w-xl"
      icon={<Sparkles className="text-accent-text mt-0.5 size-5 shrink-0" />}
    >
      新版本已经可用，刷新页面即可体验。
    </Alert>
  )
}
