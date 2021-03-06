"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SonoffRFBridgeAccessory = void 0;
const mqtt_1 = require("mqtt");
/*
 * IMPORTANT NOTICE
 *
 * One thing you need to take care of is, that you never ever ever import anything directly from the "homebridge" module (or the
 * "hap-nodejs" module).
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
 * To mitigate this the {@link API | Homebridge API} exposes the whole suite of HAP-NodeJS inside the `hap` property
 * of the api object, which can be acquired for example in the initializer function. This reference can be stored
 * like this for example and used to access all exported variables and classes from HAP-NodeJS.
 */
/*
 * Initializer function called when the plugin is loaded.
 */
class SonoffRFBridgeAccessory {
    constructor(log, config, api) {
        this.state = 0; // 1 cima 0 stop 2 baixo
        this.log = log;
        this.name = config.name;
        this.mqttClient = (0, mqtt_1.connect)(config.mqttUrl);
        this.mqttTopic = config.mqttTopic;
        this.rfCommands = [
            config.stopRfCommand,
            config.upRfCommand,
            config.downRfCommand,
        ];
        this.serviceCima = new api.hap.Service.Switch('Cima', 'UP');
        this.serviceCima.getCharacteristic(api.hap.Characteristic.On)
            .on("get" /* GET */, (callback) => {
            log.info('Current state of the switch was returned: ' + (this.state));
            callback(undefined, this.state);
        })
            .on("set" /* SET */, (value, callback) => {
            if (this.state === 2) {
                this.serviceBaixo.setCharacteristic(api.hap.Characteristic.On, false);
            }
            this.state = value ? 1 : 0;
            this.publishMessage();
            log.info('Switch state was set to: ' + (this.state));
            callback();
        });
        this.serviceBaixo = new api.hap.Service.Switch('Baixo', 'DOWN');
        this.serviceBaixo.getCharacteristic(api.hap.Characteristic.On)
            .on("get" /* GET */, (callback) => {
            log.info('Current state of the switch was returned: ' + (this.state));
            callback(undefined, this.state);
        })
            .on("set" /* SET */, (value, callback) => {
            if (this.state === 1) {
                this.serviceCima.setCharacteristic(api.hap.Characteristic.On, false);
            }
            this.state = value ? 2 : 0;
            this.publishMessage();
            log.info('Switch state was set to: ' + (this.state));
            callback();
        });
        log.info('Switch finished initializing!');
    }
    publishMessage() {
        this.mqttClient.publish(this.mqttTopic, `Backlog RfRaw ${this.rfCommands[this.state]}; RfRaw 0;`);
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        this.log('Identify!');
    }
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices() {
        return [
            this.serviceCima,
            this.serviceBaixo,
        ];
    }
}
exports.SonoffRFBridgeAccessory = SonoffRFBridgeAccessory;
//# sourceMappingURL=platformAccessory.js.map