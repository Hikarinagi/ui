import { Container, Stack } from '@hina-ui/react'
import type { Locale } from '~/lib/routes'
import { LandingActions } from './landing/Actions'
import { LandingAutoplay } from './landing/Autoplay'
import { LandingChapters } from './landing/Chapters'
import { LandingCommands } from './landing/Commands'
import { LandingCover } from './landing/Cover'
import { LandingDiscard } from './landing/Discard'
import { LandingFind } from './landing/Find'
import { LandingNotice } from './landing/Notice'
import { LandingPublished } from './landing/Published'
import { LandingRing } from './landing/Ring'
import { LandingShelf } from './landing/Shelf'
import { LandingSignIn } from './landing/SignIn'
import { LandingSort } from './landing/Sort'
import { LandingStats } from './landing/Stats'
import { LandingStorage } from './landing/Storage'
import { LandingTags } from './landing/Tags'
import { LandingUpload } from './landing/Upload'
import { LandingUploading } from './landing/Uploading'
import { LandingVerify } from './landing/Verify'
import { LandingVolumes } from './landing/Volumes'
import { LandingWorkTabs } from './landing/WorkTabs'

export function LandingWall({ locale }: { locale: Locale }) {
  return (
    <Container size="xl">
      <Container className="mx-auto max-h-[68rem] max-w-none overflow-hidden px-0 [mask-image:linear-gradient(to_bottom,#000_90%,transparent)] sm:px-0">
        <Container className="mx-auto grid w-full max-w-none grid-cols-1 gap-6 md:w-fit md:grid-cols-2 lg:grid-cols-[auto_auto_auto]">
          <Stack align="center" className="order-2 w-full gap-6 md:order-1 md:w-[340px]">
            <LandingCover locale={locale} />
            <LandingFind locale={locale} />
            <LandingShelf locale={locale} />
            <LandingVolumes locale={locale} />
            <LandingTags locale={locale} />
            <LandingActions locale={locale} />
            <LandingSort locale={locale} />
            <LandingUpload locale={locale} />
          </Stack>

          <Stack align="center" className="order-1 w-full gap-6 md:order-2 md:w-[340px]">
            <LandingSignIn locale={locale} />
            <LandingNotice locale={locale} />
            <LandingStorage locale={locale} />
            <LandingUploading locale={locale} />
            <LandingDiscard locale={locale} />
            <LandingAutoplay locale={locale} />
            <LandingChapters locale={locale} />
          </Stack>

          <Stack align="center" className="order-3 w-full gap-6 md:w-[340px]">
            <LandingCommands locale={locale} />
            <LandingStats locale={locale} />
            <LandingRing locale={locale} />
            <LandingVerify locale={locale} />
            <LandingWorkTabs locale={locale} />
            <LandingPublished locale={locale} />
          </Stack>
        </Container>
      </Container>
    </Container>
  )
}
