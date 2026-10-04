import { Card, Grid } from '@hina-ui/react'

export default function Demo() {
  return (
    <Grid cols={3} className="w-full max-w-md">
      <Card className="bg-inset col-span-2 grid h-16 place-items-center text-sm" padded={false}>
        col-span-2
      </Card>
      <Card className="bg-inset grid h-16 place-items-center text-sm" padded={false}>
        1
      </Card>
      <Card className="bg-inset col-span-3 grid h-16 place-items-center text-sm" padded={false}>
        col-span-3
      </Card>
    </Grid>
  )
}
