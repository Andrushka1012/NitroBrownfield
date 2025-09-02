// @ts-check
import {platformIOS} from '@rnef/platform-ios';
import {platformAndroid} from '@rnef/platform-android';
import {pluginMetro} from '@rnef/plugin-metro';
import { pluginBrownfieldAndroid } from '@rnef/plugin-brownfield-android';

/** @type {import('@rnef/config').Config} */
export default {
  bundler: pluginMetro(),
  platforms: {
    ios: platformIOS(),
    android: platformAndroid(),
  },
  plugins: [pluginBrownfieldAndroid()],

};
