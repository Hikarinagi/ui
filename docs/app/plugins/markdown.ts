import {
  Blockquote,
  Code,
  CodeBlock,
  Divider,
  Heading,
  Link,
  List,
  Section,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@hina-ui/vue'
import CategoryGrid from '~/components/docs/CategoryGrid.vue'
import DemoBox from '~/components/docs/DemoBox.vue'
import Playground from '~/components/docs/Playground.vue'

const primitives = {
  Blockquote,
  CategoryGrid,
  Code,
  CodeBlock,
  DemoBox,
  Divider,
  Heading,
  Link,
  List,
  Playground,
  Section,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
}

export default defineNuxtPlugin(nuxtApp => {
  for (const [name, component] of Object.entries(primitives)) {
    nuxtApp.vueApp.component(name, component)
  }
})
