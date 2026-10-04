import { Mark, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      这一段里 <Mark>被标记的文字</Mark> 带有底色。
    </Text>
  )
}
