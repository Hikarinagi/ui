import { JapaneseYen } from 'lucide-react'
import {
  Button,
  InputGroup,
  InputGroupAddon,
  NumberInput,
  SearchInput,
  Stack,
} from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-80">
      <InputGroup>
        <InputGroupAddon>
          <JapaneseYen />
        </InputGroupAddon>
        <NumberInput defaultValue={128} min={0} aria-label="Price" />
      </InputGroup>
      <InputGroup>
        <SearchInput defaultValue="" aria-label="Search" placeholder="Search works" />
        <Button>Search</Button>
      </InputGroup>
    </Stack>
  )
}
