import { h } from 'vue'
import VDescriptionList from '@hina-ui/vue/components/description-list/DescriptionList.vue'
import VDescriptionTerm from '@hina-ui/vue/components/description-list/DescriptionTerm.vue'
import VDescriptionDetails from '@hina-ui/vue/components/description-list/DescriptionDetails.vue'
import { DescriptionList } from '@hina-ui/react/components/description-list/DescriptionList'
import { DescriptionTerm } from '@hina-ui/react/components/description-list/DescriptionTerm'
import { DescriptionDetails } from '@hina-ui/react/components/description-list/DescriptionDetails'
import { defineCases } from '../src/cases'

export default defineCases('DescriptionList', [
  {
    name: 'raw dt and dd',
    vue: () =>
      h(VDescriptionList, null, () => [
        h('dt', '原名'),
        h('dd', '狼と香辛料'),
        h('dt', '作者'),
        h('dd', '未知'),
      ]),
    react: () => (
      <DescriptionList>
        <dt>原名</dt>
        <dd>狼と香辛料</dd>
        <dt>作者</dt>
        <dd>未知</dd>
      </DescriptionList>
    ),
  },
  {
    name: 'term and details parts',
    vue: () =>
      h(VDescriptionList, { class: 'max-w-sm' }, () => [
        h(VDescriptionTerm, () => '状态'),
        h(VDescriptionDetails, () => '连载中'),
        h(VDescriptionTerm, () => '分级'),
        h(VDescriptionDetails, () => '全年龄'),
      ]),
    react: () => (
      <DescriptionList className="max-w-sm">
        <DescriptionTerm>状态</DescriptionTerm>
        <DescriptionDetails>连载中</DescriptionDetails>
        <DescriptionTerm>分级</DescriptionTerm>
        <DescriptionDetails>全年龄</DescriptionDetails>
      </DescriptionList>
    ),
  },
  {
    name: 'one term with several details',
    vue: () =>
      h(VDescriptionList, null, () => [
        h(VDescriptionTerm, () => '作者'),
        h(VDescriptionDetails, () => '支倉凍砂'),
        h(VDescriptionDetails, () => '文倉十'),
      ]),
    react: () => (
      <DescriptionList>
        <DescriptionTerm>作者</DescriptionTerm>
        <DescriptionDetails>支倉凍砂</DescriptionDetails>
        <DescriptionDetails>文倉十</DescriptionDetails>
      </DescriptionList>
    ),
  },
  {
    name: 'grid columns class',
    vue: () =>
      h(
        VDescriptionList,
        { class: 'grid max-w-md grid-cols-[8rem_1fr] gap-y-3 [&>dd]:m-0! [&>dt]:m-0!' },
        () => [h(VDescriptionTerm, () => '册数'), h(VDescriptionDetails, () => '全 7 卷')],
      ),
    react: () => (
      <DescriptionList className="grid max-w-md grid-cols-[8rem_1fr] gap-y-3 [&>dd]:m-0! [&>dt]:m-0!">
        <DescriptionTerm>册数</DescriptionTerm>
        <DescriptionDetails>全 7 卷</DescriptionDetails>
      </DescriptionList>
    ),
  },
  {
    name: 'parts with class and attributes',
    vue: () =>
      h(VDescriptionList, null, () => [
        h(VDescriptionTerm, { class: 'text-muted', id: 't' }, () => '原名'),
        h(VDescriptionDetails, { class: 'tabular', 'aria-describedby': 't' }, () => '狼と香辛料'),
      ]),
    react: () => (
      <DescriptionList>
        <DescriptionTerm className="text-muted" id="t">
          原名
        </DescriptionTerm>
        <DescriptionDetails className="tabular" aria-describedby="t">
          狼と香辛料
        </DescriptionDetails>
      </DescriptionList>
    ),
  },
  {
    name: 'empty parts',
    vue: () => h(VDescriptionList, null, () => [h(VDescriptionTerm), h(VDescriptionDetails)]),
    react: () => (
      <DescriptionList>
        <DescriptionTerm />
        <DescriptionDetails />
      </DescriptionList>
    ),
  },
])
