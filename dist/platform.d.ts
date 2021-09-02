import { API, DynamicPlatformPlugin, Logging, PlatformAccessory, PlatformConfig } from 'homebridge';
export declare class SonoffRFBridgePlatform implements DynamicPlatformPlugin {
    private readonly log;
    private readonly api;
    private requestServer?;
    private readonly accessories;
    constructor(log: Logging, config: PlatformConfig, api: API);
    configureAccessory(accessory: PlatformAccessory): void;
    addAccessory(name: string): void;
    removeAccessories(): void;
    createHttpService(): void;
    private handleRequest;
}
//# sourceMappingURL=platform.d.ts.map