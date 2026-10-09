<script setup lang="ts">
  import { LineClamp, Text } from '@hina-ui/vue'
</script>

<template>
  <LineClamp :lines="4" class="w-full max-w-md">
    <Text size="sm" tone="muted">
      第一卷收录连载的前十二话，从转学第一天写到那年的文化祭。单行本修订了连载时的全部对白，并重绘了三处跨页。
    </Text>
    <Text size="sm" tone="muted">
      卷末附有两篇未公开的短篇。一篇以摄影部顾问的视角补完了旧相机的来历，另一篇是发生在暑假的番外，讲两人为了拍到一场流星雨在天台守了整整一夜。
    </Text>
    <Text size="sm" tone="muted">
      初版随书附赠一张明信片，图案为封面的线稿。电子版不含赠品，正文内容与纸质版一致。
    </Text>
  </LineClamp>
</template>
