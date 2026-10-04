import { Mail } from 'lucide-react'
import { Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <Input
      defaultValue="shion@hoshimi.moe"
      type="email"
      clearable
      aria-label="Email"
      className="w-72"
      leading={<Mail />}
    />
  )
}
