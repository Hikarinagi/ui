import { Mail } from 'lucide-react'
import { Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <Input loading defaultValue="shion@hoshimi.moe" aria-label="校验邮箱中" leading={<Mail />} />
      <Input loading defaultValue="hoshimi" aria-label="校验昵称中" />
    </Stack>
  )
}
