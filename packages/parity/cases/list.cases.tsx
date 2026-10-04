import { h } from 'vue'
import VList from '@hina-ui/vue/components/list/List.vue'
import VListItem from '@hina-ui/vue/components/list/ListItem.vue'
import { List } from '@hina-ui/react/components/list/List'
import { ListItem } from '@hina-ui/react/components/list/ListItem'
import { defineCases } from '../src/cases'

export default defineCases('List', [
  {
    name: 'unordered with raw items',
    vue: () => h(VList, null, () => [h('li', '甲'), h('li', '乙')]),
    react: () => (
      <List>
        <li>甲</li>
        <li>乙</li>
      </List>
    ),
  },
  {
    name: 'ordered with ListItem',
    vue: () =>
      h(VList, { ordered: true, class: 'max-w-md' }, () => [
        h(VListItem, () => '安装依赖'),
        h(VListItem, () => '引入样式'),
      ]),
    react: () => (
      <List ordered className="max-w-md">
        <ListItem>安装依赖</ListItem>
        <ListItem>引入样式</ListItem>
      </List>
    ),
  },
  {
    name: 'numbering attributes fall through',
    vue: () =>
      h(VList, { ordered: true, start: 5, reversed: true }, () => [
        h(VListItem, () => '从第五项开始'),
      ]),
    react: () => (
      <List ordered start={5} reversed>
        <ListItem>从第五项开始</ListItem>
      </List>
    ),
  },
  {
    name: 'nested list',
    vue: () =>
      h(VList, null, () => [
        h(VListItem, () => [
          '排版',
          h(VList, () => [h(VListItem, () => 'Text'), h(VListItem, () => 'Heading')]),
        ]),
      ]),
    react: () => (
      <List>
        <ListItem>
          排版
          <List>
            <ListItem>Text</ListItem>
            <ListItem>Heading</ListItem>
          </List>
        </ListItem>
      </List>
    ),
  },
  {
    name: 'ListItem class and native attributes',
    vue: () => h(VList, null, () => [h(VListItem, { class: 'font-medium', value: 3 }, () => '甲')]),
    react: () => (
      <List>
        <ListItem className="font-medium" value={3}>
          甲
        </ListItem>
      </List>
    ),
  },
  {
    name: 'empty',
    vue: () => h(VList, { ordered: false }),
    react: () => <List ordered={false} />,
  },
])
