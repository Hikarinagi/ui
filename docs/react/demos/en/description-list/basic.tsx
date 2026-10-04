import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/react'

export default function Demo() {
  return (
    <DescriptionList className="max-w-sm">
      <DescriptionTerm>Status</DescriptionTerm>
      <DescriptionDetails>Ongoing</DescriptionDetails>
      <DescriptionTerm>Rating</DescriptionTerm>
      <DescriptionDetails>All ages</DescriptionDetails>
    </DescriptionList>
  )
}
