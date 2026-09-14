import { expectTypeOf } from 'vitest'
import { Dialog, Drawer, Sheet } from '../../src'

expectTypeOf<InstanceType<typeof Dialog>['viewport']>().toEqualTypeOf<HTMLElement | undefined>()
expectTypeOf<InstanceType<typeof Drawer>['viewport']>().toEqualTypeOf<HTMLElement | undefined>()
expectTypeOf<InstanceType<typeof Sheet>['viewport']>().toEqualTypeOf<HTMLElement | undefined>()
