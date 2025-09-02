import type { HybridView, HybridViewProps, HybridViewMethods } from 'react-native-nitro-modules'

export interface CameraProps extends HybridViewProps {
  enableFlash: boolean
}
export interface CameraMethods extends HybridViewMethods { }

export type CameraView = HybridView<CameraProps, CameraMethods>