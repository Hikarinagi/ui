import { Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <Input
      defaultValue="狼と香辛料"
      clearable
      aria-label="关键词"
      placeholder="关键词"
      className="w-72"
    />
  )
}
