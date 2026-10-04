'use client'

import { Button, Dialog, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Dialog
        title="Centred"
        placement="center"
        renderContent={() => <Text>Stays centred at every screen width.</Text>}
      >
        <Button variant="outline" tone="neutral">
          center
        </Button>
      </Dialog>
      <Dialog
        title="Along the top"
        placement="top"
        renderContent={() => (
          <Text>Slides in from above with space at the top, including on narrow screens.</Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          top
        </Button>
      </Dialog>
      <Dialog
        title="Along the bottom"
        placement="bottom"
        renderContent={() => <Text>Slides up from the bottom and keeps its rounded corners.</Text>}
      >
        <Button variant="outline" tone="neutral">
          bottom
        </Button>
      </Dialog>
      <Dialog
        title="Following the screen"
        renderContent={() => (
          <Text>
            Centred on a wide screen; on a narrow one it sits along the bottom and fills the width.
            Narrow the window and open it again to see it.
          </Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          default
        </Button>
      </Dialog>
    </Inline>
  )
}
