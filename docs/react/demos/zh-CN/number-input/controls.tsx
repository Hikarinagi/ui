import { NumberInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <NumberInput controls={false} min={1} placeholder="页码" aria-label="页码" className="w-40" />
  )
}
