import { ExternalLink } from 'lucide-react'
import { Center, Link, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-md">
      这段话中间嵌着一个{' '}
      <Center inline className="gap-1">
        <Link href="#">外部链接</Link>
        <ExternalLink className="size-3.5" />
      </Center>{' '}
      ，图标与文字在同一行里对齐。
    </Text>
  )
}
