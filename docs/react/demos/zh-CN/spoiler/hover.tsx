import { Spoiler, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      指针移入即可看到 <Spoiler revealOn="hover">悬停揭示的内容</Spoiler> ，移出后重新遮住。
    </Text>
  )
}
