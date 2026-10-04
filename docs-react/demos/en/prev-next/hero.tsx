import { PrevNext, PrevNextLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <PrevNext className="w-full max-w-2xl">
      <PrevNextLink direction="prev" href="#">
        Chapter 2 Cicada Rain
      </PrevNextLink>
      <PrevNextLink direction="next" href="#">
        Chapter 4 Distant Thunder
      </PrevNextLink>
    </PrevNext>
  )
}
