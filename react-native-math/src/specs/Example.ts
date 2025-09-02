import { NitroModules } from 'react-native-nitro-modules'
import type { Math } from './Math.nitro'

export function quickAdd(a: number, b: number) {
  const math = NitroModules.createHybridObject<Math>('Math')
  return math.add(a, b)
}
