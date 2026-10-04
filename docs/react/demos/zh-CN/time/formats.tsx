import { DescriptionDetails, DescriptionList, DescriptionTerm, Time } from '@hina-ui/react'

const value = '2026-03-14T09:30:00+08:00'

export default function Demo() {
  return (
    <DescriptionList className="grid max-w-sm grid-cols-[6rem_1fr] gap-y-2 [&>dd]:m-0! [&>dt]:m-0!">
      <DescriptionTerm>datetime</DescriptionTerm>
      <DescriptionDetails>
        <Time value={value} />
      </DescriptionDetails>
      <DescriptionTerm>date</DescriptionTerm>
      <DescriptionDetails>
        <Time value={value} format="date" />
      </DescriptionDetails>
      <DescriptionTerm>time</DescriptionTerm>
      <DescriptionDetails>
        <Time value={value} format="time" />
      </DescriptionDetails>
      <DescriptionTerm>relative</DescriptionTerm>
      <DescriptionDetails>
        <Time value={value} format="relative" />
      </DescriptionDetails>
    </DescriptionList>
  )
}
