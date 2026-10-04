import { FileUpload } from '@hina-ui/react'

export default function Demo() {
  return (
    <FileUpload
      defaultValue={[]}
      multiple
      accept="image/*"
      aria-label="Upload screenshots"
      className="w-96"
    />
  )
}
