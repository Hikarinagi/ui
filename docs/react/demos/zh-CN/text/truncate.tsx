import { Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text truncate className="max-w-xs">
      很长很长的一段文字会在容器边界处截断并显示省略号
    </Text>
  )
}
