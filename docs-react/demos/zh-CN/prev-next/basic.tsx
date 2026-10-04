import { PrevNext, PrevNextLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <PrevNext className="w-full max-w-2xl">
      <PrevNextLink direction="prev" href="#">
        Breadcrumb
      </PrevNextLink>
      <PrevNextLink direction="next" href="#">
        Splitter
      </PrevNextLink>
    </PrevNext>
  )
}
