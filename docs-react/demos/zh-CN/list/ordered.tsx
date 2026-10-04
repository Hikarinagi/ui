import { List, ListItem } from '@hina-ui/react'

export default function Demo() {
  return (
    <List ordered className="max-w-md">
      <ListItem>安装依赖</ListItem>
      <ListItem>引入样式</ListItem>
      <ListItem>启动开发服务器</ListItem>
    </List>
  )
}
