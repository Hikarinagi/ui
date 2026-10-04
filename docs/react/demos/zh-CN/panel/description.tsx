import { Panel, Switch } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel
      title="公开资料"
      description="这些信息会显示在你的个人页上，所有人可见。"
      className="w-96"
    >
      <Switch>显示收藏列表</Switch>
    </Panel>
  )
}
