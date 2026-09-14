import { expectTypeOf } from 'vitest'
import { Dialog, Drawer, Sheet } from '../../src'

type DialogSlots = InstanceType<typeof Dialog>['$slots']
expectTypeOf<InstanceType<typeof Drawer>['$slots']>().toEqualTypeOf<DialogSlots>()
expectTypeOf<InstanceType<typeof Sheet>['$slots']>().toEqualTypeOf<DialogSlots>()
