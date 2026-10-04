import { Blockquote, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Blockquote cite="访谈记录" className="flex max-w-lg flex-col gap-3">
      <Text>最初的版本只有一个输入框，我们花了三个月才承认它不够用。</Text>
      <Text>后来加进去的每一项功能，都要先回答一个问题：它替谁省下了时间。</Text>
    </Blockquote>
  )
}
