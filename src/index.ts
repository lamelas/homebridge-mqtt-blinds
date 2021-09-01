import { API } from 'homebridge';

import { PLATFORM_NAME, ACCESSORY_NAME } from './settings';
import { SonoffRFBridgePlatform } from './platform';
import { SonoffRFBridgeAccessory } from './platformAccessory';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, SonoffRFBridgePlatform);
  api.registerAccessory(ACCESSORY_NAME, SonoffRFBridgeAccessory);
};
