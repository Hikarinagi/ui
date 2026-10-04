import { Code, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      执行 <Code>pnpm add @hina-ui/react</Code> 安装依赖，然后在样式入口引入 <Code>tokens.css</Code>
      。
    </Text>
  )
}
