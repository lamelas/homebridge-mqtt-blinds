"use strict";
const settings_1 = require("./settings");
const platform_1 = require("./platform");
const platformAccessory_1 = require("./platformAccessory");
module.exports = (api) => {
    api.registerPlatform(settings_1.PLATFORM_NAME, platform_1.SonoffRFBridgePlatform);
    api.registerAccessory(settings_1.ACCESSORY_NAME, platformAccessory_1.SonoffRFBridgeAccessory);
};
//# sourceMappingURL=index.js.map