import { Panel, Switch } from '@hina-ui/react'

export default function Demo() {
  return (
    <Panel
      title="Public profile"
      description="This information shows on your profile page and is visible to everyone."
      className="w-96"
    >
      <Switch>Show my bookmarks</Switch>
    </Panel>
  )
}
