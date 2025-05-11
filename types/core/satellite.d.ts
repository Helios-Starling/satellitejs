/**
 * @typedef {import("@helios-starling/starling").StarlingOptions & {
 *   healthCheckInterval: number=30000,
 *   autoReconnect: boolean=true,
 * }} SatelliteOptions
 */
/**
* @typedef {Object} CallOptions
* @property {import('sift').Query<*>} [query] - Service selection query
* @property {number} [timeout] - Request timeout
* @property {boolean} [broadcast=false] - Whether to broadcast to all matching services
*/
export class Satellite extends Starling {
    /**
    * @param {string} url - Broker URL
    * @param {import('@broker-satellite/utils').ManifestDocument} manifest - Service manifest
    * @param {SatelliteOptions} [options={}] - Satellite options
    */
    constructor(url: string, manifest: import("@broker-satellite/utils").ManifestDocument, options?: SatelliteOptions);
    _manifest: Manifest;
    _status: string;
    _options: {
        /**
         * Enable debug mode
         */
        debug?: boolean;
        connectTimeout: number;
        state: import("@helios-starling/starling/src/managers/state").StateManagerOptions;
        reconnection: import("@helios-starling/starling/src/managers/reconnection").ReconnectionOptions | false;
        healthCheckInterval: number;
        autoReconnect: boolean;
    };
    /**
    * Exposes a service method
    * @param {string} name - Method name
    * @param {import('@helios-starling/starling/utils').MethodHandler} handler - Method handler
    * @param {import('@broker-satellite/utils').ServiceMethodSchemas} [schema] - Method schema
    * @returns {this} For chaining
    */
    expose(name: string, handler: any, schema?: import("@broker-satellite/utils").ServiceMethodSchemas): this;
    /**
    * Calls a method on another service via the broker
    * @param {string} method - Method name
    * @param {*} payload - Method payload
    * @param {CallOptions} [options={}] - Call options
    * @returns {Promise<*>} Method response
    */
    call(method: string, payload?: any, options?: CallOptions): Promise<any>;
    /**
    * Updates service status
    * @param {import('@broker-satellite/utils').ServiceStatus} status
    * @param {Object} [metrics] - Additional metrics
    */
    updateStatus(status: import("@broker-satellite/utils").ServiceStatus, metrics?: any): void;
    /**
    * @private
    */
    private _setupInternalMethods;
    /**
     * @private
     */
    private _setupInternalTopics;
    /**
     *
     */
    /**
    * Gets current service status
    */
    get status(): string;
    /**
    * Gets service manifest
    */
    get manifest(): Manifest;
}
export type SatelliteOptions = import("@helios-starling/starling").StarlingOptions & {
    healthCheckInterval: number;
    autoReconnect: boolean;
};
export type CallOptions = {
    /**
     * - Service selection query
     */
    query?: import("sift").Query<any>;
    /**
     * - Request timeout
     */
    timeout?: number;
    /**
     * - Whether to broadcast to all matching services
     */
    broadcast?: boolean;
};
import { Starling } from '@helios-starling/starling';
import { Manifest } from '@broker-satellite/utils';
