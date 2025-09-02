import { getHostComponent } from "react-native-nitro-modules";
import type { CameraMethods, CameraProps } from "./specs/Camera.nitro";
import CameraViewConfig from '../nitrogen/generated/shared/json/CameraViewConfig.json'

export const Camera = getHostComponent<CameraProps, CameraMethods>(
    'CameraView',
    () => CameraViewConfig
  )