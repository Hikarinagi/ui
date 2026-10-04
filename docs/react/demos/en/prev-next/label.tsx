import { PrevNext, PrevNextLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <PrevNext label="Volume pagination" className="w-full max-w-2xl">
      <PrevNextLink direction="prev" label="Previous volume" href="#">
        Volume 2
      </PrevNextLink>
      <PrevNextLink direction="next" label="Next volume" href="#">
        Volume 4
      </PrevNextLink>
    </PrevNext>
  )
}
