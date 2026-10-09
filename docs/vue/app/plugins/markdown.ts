import CategoryGrid from '~/components/docs/CategoryGrid.vue'
import ComponentsOverview from '~/components/docs/ComponentsOverview.vue'
import Playground from '~/components/docs/Playground.vue'

const authored = { CategoryGrid, ComponentsOverview, Playground }

export default defineNuxtPlugin(nuxtApp => {
  for (const [name, component] of Object.entries(authored)) {
    nuxtApp.vueApp.component(name, component)
  }
})
