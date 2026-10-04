import { Spoiler, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-sm">
      <Spoiler>
        跨越多行的剧透同样可以整段遮住，揭示时从指针落点开始展开，逐行铺满整段文字。
      </Spoiler>
    </Text>
  )
}
