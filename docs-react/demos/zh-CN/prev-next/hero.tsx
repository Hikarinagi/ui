import { PrevNext, PrevNextLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <PrevNext className="w-full max-w-2xl">
      <PrevNextLink direction="prev" href="#">
        第 II 章
      </PrevNextLink>
      <PrevNextLink direction="next" href="#">
        第 IV 章
      </PrevNextLink>
    </PrevNext>
  )
}
