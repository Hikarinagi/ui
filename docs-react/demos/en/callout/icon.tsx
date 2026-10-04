import { BookOpen } from 'lucide-react'
import { Callout, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Callout icon={false}>Without an icon the text fills the whole width of the note.</Callout>
      <Callout tone="info" icon={<BookOpen className="text-info-text mt-0.5 size-5 shrink-0" />}>
        Swap in an icon that suits the content.
      </Callout>
    </Stack>
  )
}
