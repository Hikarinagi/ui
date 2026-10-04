import { Link, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-lg">
      组件的完整清单见
      <Link href="https://github.com/Hikarinagi/ui" target="_blank" rel="noreferrer" underline>
        仓库首页
      </Link>
      ，样式变量的说明在安装指南里。
    </Text>
  )
}
