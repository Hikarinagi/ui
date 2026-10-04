import { Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <Input
      defaultValue="Spice and Wolf"
      clearable
      aria-label="Keyword"
      placeholder="Keyword"
      className="w-72"
    />
  )
}
