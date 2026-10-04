import { Card, Grid } from '@hina-ui/react'

export default function Demo() {
  return (
    <Grid cols={3} className="w-full max-w-md">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="bg-inset grid h-16 place-items-center" padded={false}>
          {i}
        </Card>
      ))}
    </Grid>
  )
}
