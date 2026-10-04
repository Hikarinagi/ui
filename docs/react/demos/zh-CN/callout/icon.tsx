import { BookOpen } from 'lucide-react'
import { Callout, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Callout icon={false}>隐藏图标后，正文占满标注的整个宽度。</Callout>
      <Callout tone="info" icon={<BookOpen className="text-info-text mt-0.5 size-5 shrink-0" />}>
        替换为与内容相关的图标。
      </Callout>
    </Stack>
  )
}
