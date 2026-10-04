import { CodeBlock } from '@hina-ui/react'

const output = `✔ 依赖安装完成
✔ 样式入口已就绪
  运行 pnpm dev 启动开发服务器`

export default function Demo() {
  return <CodeBlock code={output} className="w-full max-w-xl" />
}
