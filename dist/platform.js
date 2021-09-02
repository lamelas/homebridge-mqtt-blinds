"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonoffRFBridgePlatform = void 0;
const settings_1 = require("./settings");
const http_1 = __importDefault(require("http"));
/*
 * IMPORTANT NOTICE
 *
 * One thing you need to take care of is, that you never ever ever import anything directly from the "homebridge" module (or the
 * "this.api.hap-nodejs" module).
 * The above import block may seem like, that we do exactly that, but actually those imports are only used for types and interfaces
 * and will disappear once the code is compiled to Javascript.
 * In fact you can check that by running `npm run build` and opening the compiled Javascript file in the `dist` folder.
 * You will notice that the file does not contain a `... = require("homebridge");` statement anywhere in the code.
 *
 * The contents of the above import statement MUST ONLY be used for type annotation or accessing things like CONST ENUMS,
 * which is a special case as they get replaced by the actual value and do not remain as a reference in the compiled code.
 * Meaning normal enums are bad, const enums can be used.
 *
 * You MUST NOT import anything else which remains as a reference in the code, as this will result in
 * a `... = require("homebridge");` to be compiled into the final Javascript code.
 * This typically leads to unexpected behavior at runtime, as in many cases it won't be able to find the module
 * or will import another instance of homebridge causing collisions.
 *
 * To mitigate this the {@link API | Homebridge API} exposes the whole suite of HAP-NodeJS inside the `this.api.hap` property
 * of the api object, which can be acquired for example in the initializer function. This reference can be stored
 * like this for example and used to access all exported variables and classes from HAP-NodeJS.
 */
class SonoffRFBridgePlatform {
    constructor(log, config, api) {
        this.accessories = [];
        this.log = log;
        this.api = api;
        // probably parse config or something here
        log.info('Example platform finished initializing!');
        /*
         * When this event is fired, homebridge restored all cached accessories from disk and did call their respective
         * `configureAccessory` method for all of them. Dynamic Platform plugins should only register new accessories
         * after this event was fired, in order to ensure they weren't added to homebridge already.
         * This event can also be used to start discovery of new accessories.
         */
        api.on("didFinishLaunching" /* DID_FINISH_LAUNCHING */, () => {
            log.info('Example platform \'didFinishLaunching\'');
            // The idea of this plugin is that we open a http service which exposes api calls to add or remove accessories
            this.createHttpService();
        });
    }
    /*
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory) {
        this.log('Configuring accessory %s', accessory.displayName);
        accessory.on("identify" /* IDENTIFY */, () => {
            this.log('%s identified!', accessory.displayName);
        });
        accessory.getService(this.api.hap.Service.Lightbulb).getCharacteristic(this.api.hap.Characteristic.On)
            .on("set" /* SET */, (value, callback) => {
            this.log.info('%s Light was set to: ' + value);
            callback();
        });
        this.accessories.push(accessory);
    }
    // --------------------------- CUSTOM METHODS ---------------------------
    addAccessory(name) {
        this.log.info('Adding new accessory with name %s', name);
        // eslint-disable-next-line max-len
        // uuid must be generated from a unique but not changing data source, name should not be used in the most cases. But works in this specific example.
        const uuid = this.api.hap.uuid.generate(name);
        const accessory = new this.api.platformAccessory(name, uuid);
        accessory.addService(this.api.hap.Service.Lightbulb, 'Test Light');
        this.configureAccessory(accessory); // abusing the configureAccessory here
        this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
    }
    removeAccessories() {
        // we don't have any special identifiers, we just remove all our accessories
        this.log.info('Removing all accessories');
        this.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, this.accessories);
        this.accessories.splice(0, this.accessories.length); // clear out the array
    }
    createHttpService() {
        this.requestServer = http_1.default.createServer(this.handleRequest.bind(this));
        this.requestServer.listen(18081, () => this.log.info('Http server listening on 18081...'));
    }
    handleRequest(request, response) {
        if (request.url === '/add') {
            this.addAccessory(new Date().toISOString());
        }
        else if (request.url === '/remove') {
            this.removeAccessories();
        }
        response.writeHead(204); // 204 No content
        response.end();
    }
}
exports.SonoffRFBridgePlatform = SonoffRFBridgePlatform;
//# sourceMappingURL=platform.js.map