import { Stepper } from '@hina-ui/react'

const items = [
  { title: 'Step A', description: 'The first description' },
  { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
  { title: 'Step C', description: 'The final description' },
]

export default function Demo() {
  return <Stepper items={items} defaultValue={2} />
}
