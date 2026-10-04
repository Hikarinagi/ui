import { Timeline, type TimelineTone } from '@hina-ui/react'

const tones: TimelineTone[] = ['accent', 'neutral', 'success', 'warning', 'danger', 'info']
const items = tones.map(tone => ({ id: tone, title: tone, tone }))

export default function Demo() {
  return <Timeline items={items} />
}
