import { NumberInput } from '@hina-ui/react'

export default function Demo() {
  return <NumberInput defaultValue={3} min={0} max={10} aria-label="Quantity" className="w-40" />
}
