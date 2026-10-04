<script setup lang="ts">
  import { ref } from 'vue'
  import { Carousel, Image } from '@hina-ui/vue'
  import { dataListDemo } from '../../data-list'
  const items = dataListDemo('en').slice(0, 5)
  const index = ref(2)
</script>
<template>
  <Carousel
    v-model:index="index"
    :items="items"
    :get-key="item => item.id"
    indicators
    label="Cover gallery"
    class="max-w-lg"
  >
    <template #default="{ item }">
      <Image
        :src="item.cover.src"
        :alt="item.title"
        :ratio="4 / 3"
        :draggable="false"
        class="rounded-xl"
      />
    </template>
  </Carousel>
</template>
