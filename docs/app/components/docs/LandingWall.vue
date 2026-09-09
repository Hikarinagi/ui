<script setup lang="ts">
  import { Container, Stack } from '@hina-ui/vue'

  defineOptions({ name: 'DocsLandingWall' })
</script>

<template>
  <Container size="xl">
    <Container
      class="mx-auto max-h-[70rem] max-w-none overflow-hidden px-0 [mask-image:linear-gradient(to_bottom,#000_90%,transparent)] sm:px-0"
    >
      <Container
        class="mx-auto grid w-full max-w-none grid-cols-1 gap-6 md:w-fit md:grid-cols-2 lg:grid-cols-[auto_auto_auto]"
      >
        <Stack align="center" class="order-2 w-full gap-6 md:w-[340px] md:order-1">
          <LandingCover />
          <LandingFind />
          <LandingShelf />
          <LandingVolumes />
          <LandingUploading />
          <LandingTags />
          <LandingActions />
          <LandingSort />
          <LandingUpload />
        </Stack>

        <Stack align="center" class="order-1 w-full gap-6 md:w-[340px] md:order-2">
          <LandingRelease />
          <LandingNotice />
          <LandingStorage />
          <LandingDiscard />
          <LandingAutoplay />
          <LandingChapters />
        </Stack>

        <Stack align="center" class="order-3 w-full gap-6 md:w-[340px]">
          <LandingCommands />
          <LandingStats />
          <LandingRing />
          <LandingVerify />
          <LandingWorkTabs />
          <LandingPublished />
        </Stack>
      </Container>
    </Container>
  </Container>
</template>
