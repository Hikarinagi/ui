import { Mail } from 'lucide-react'
import { Input, Kbd, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <Input type="email" aria-label="Email" placeholder="Email" leading={<Mail />} />
      <Input inputMode="decimal" aria-label="Weight" placeholder="Weight" trailing="kg" />
      <Input aria-label="Quick jump" placeholder="Quick jump" trailing={<Kbd>/</Kbd>} />
    </Stack>
  )
}
