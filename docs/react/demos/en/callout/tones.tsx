import { Callout, Stack } from '@hina-ui/react'

const tones = [
  { tone: 'neutral', text: 'A plain aside, carrying no mood' },
  { tone: 'accent', text: 'A shortcut worth trying' },
  { tone: 'info', text: 'Background that relates to the current content' },
  { tone: 'success', text: 'The recommended way to do it' },
  { tone: 'warning', text: 'Something to weigh before going ahead' },
  { tone: 'danger', text: 'This cannot be undone' },
] as const

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      {tones.map(item => (
        <Callout key={item.tone} tone={item.tone}>
          {item.text}
        </Callout>
      ))}
    </Stack>
  )
}
