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
        <NumberInput defaultValue={128} min={0} aria-label="价格" />
      </InputGroup>
      <InputGroup>
        <SearchInput defaultValue="" aria-label="搜索" placeholder="搜索作品" />
        <Button>搜索</Button>
      </InputGroup>
    </Stack>
  )
}
