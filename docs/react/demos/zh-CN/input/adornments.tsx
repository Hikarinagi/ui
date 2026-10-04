import { Mail } from 'lucide-react'
import { Input, Kbd, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <Input type="email" aria-label="邮箱" placeholder="邮箱" leading={<Mail />} />
      <Input inputMode="decimal" aria-label="体重" placeholder="体重" trailing="kg" />
      <Input aria-label="快速跳转" placeholder="快速跳转" trailing={<Kbd>/</Kbd>} />
    </Stack>
  )
}
