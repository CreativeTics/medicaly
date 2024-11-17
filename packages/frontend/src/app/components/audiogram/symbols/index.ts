import { getLeftAirMaskedIcon } from './left-air-masked'
import { getLeftAirUnmaskedIcon } from './left-air-unmasked'
import { getLeftBoneMaskedIcon } from './left-bone-masked'
import { getLeftBoneUnmaskedIcon } from './left-bone-unmasked'
import { getRightAirMaskedIcon } from './right-air-masked'
import { getRightAirUnmaskedIcon } from './right-air-unmasked'
import { getRightBoneUnmaskedIcon } from './right-bone-unmasked'
import { getRightBoneMaskedIcon } from './right-bone-masked'

export function loadSymbols(size: number) {
  const symbols = new Map<string, HTMLImageElement>()
  const defaultImage = new Image()

  // left ear
  symbols.set('ear_left_air_unmasked', getLeftAirUnmaskedIcon(size))
  symbols.set('ear_left_air_masked', getLeftAirMaskedIcon(size))
  symbols.set('ear_left_bone_unmasked', getLeftBoneUnmaskedIcon(size))
  symbols.set('ear_left_bone_masked', getLeftBoneMaskedIcon(size))

  // right ear
  symbols.set('ear_right_air_unmasked', getRightAirUnmaskedIcon(size))
  symbols.set('ear_right_air_masked', getRightAirMaskedIcon(size))
  symbols.set('ear_right_bone_unmasked', getRightBoneUnmaskedIcon(size))
  symbols.set('ear_right_bone_masked', getRightBoneMaskedIcon(size))

  return symbols
}
