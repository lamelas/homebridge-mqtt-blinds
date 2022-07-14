import { AccessoryConfig, AccessoryPlugin, API, Logging, Service } from 'homebridge';
export declare class SonoffRFBridgeAccessory implements AccessoryPlugin {
    private readonly log;
    private readonly name;
    private readonly mqttClient;
    private readonly mqttTopic;
    private readonly rfCommands;
    private state;
    private readonly serviceCima;
    private readonly serviceBaixo;
    constructor(log: Logging, config: AccessoryConfig, api: API);
    publishMessage(): void;
    identify(): void;
    getServices(): Service[];
}
//# sourceMappingURL=platformAccessory.d.ts.map