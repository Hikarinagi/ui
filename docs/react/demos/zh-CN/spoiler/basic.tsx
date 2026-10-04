import { Spoiler, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      点击揭示 <Spoiler>这段被遮住的文字</Spoiler> ，再点一次重新遮住。
    </Text>
  )
}
