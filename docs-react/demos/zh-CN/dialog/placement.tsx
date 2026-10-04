'use client'

import { Button, Dialog, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Dialog
        title="居中"
        placement="center"
        renderContent={() => <Text>任何屏幕宽度下都居中显示。</Text>}
      >
        <Button variant="outline" tone="neutral">
          center
        </Button>
      </Dialog>
      <Dialog
        title="贴顶"
        placement="top"
        renderContent={() => <Text>从顶部滑入，保留顶部留白，窄屏上也保持贴顶。</Text>}
      >
        <Button variant="outline" tone="neutral">
          top
        </Button>
      </Dialog>
      <Dialog
        title="贴底"
        placement="bottom"
        renderContent={() => <Text>从底部滑入，四角保留圆角。</Text>}
      >
        <Button variant="outline" tone="neutral">
          bottom
        </Button>
      </Dialog>
      <Dialog
        title="随屏幕变化"
        renderContent={() => (
          <Text>宽屏居中，窄屏贴底并占满宽度。缩窄窗口后重新打开即可看到。</Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          默认
        </Button>
      </Dialog>
    </Inline>
  )
}
