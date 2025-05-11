import { Starling } from '@helios-starling/starling';
import { Manifest, ServiceStatus } from '@broker-satellite/utils';

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
    constructor(url, manifest, options = {}) {
        super(url, {
            ...(options || {}),
            debug: true
        });

        
        // Initialize manifest
        this._manifest = new Manifest(manifest);
        
        // Setup internal state
        this._status = ServiceStatus.STARTING;
        
        // Configure options
        this._options = {
            healthCheckInterval: 30000,
            autoReconnect: true,
            ...options
        };
        
        // Setup built-in methods
        this._setupInternalMethods();
        
        // Setup built-in topic
        this._setupInternalTopics();


    }
    
    /**
    * Exposes a service method
    * @param {string} name - Method name
    * @param {import('@helios-starling/starling/utils').MethodHandler} handler - Method handler
    * @param {import('@broker-satellite/utils').ServiceMethodSchemas} [schema] - Method schema
    * @returns {this} For chaining
    */
    expose(name, handler, schema = null) {
        // Add to manifest if not exists
        if (!this._manifest.methods.find(m => m.name === name)) {
            this._manifest.addMethod({
                name,
                schema
            });
        }
        
        // Register method handler
        this.method(name, async (context) => {
            try {
                // Validate input if schema exists
                if (schema?.input) {
                    const valid = this._manifest.validateMethodInput(name, context.payload);
                    if (!valid) {
                        throw new Error('Invalid input payload');
                    }
                }

                context.success = (data) => {
                    if (schema?.output) {
                        const valid = this._manifest.validateMethodOutput(name, data);
                        if (!valid) {
                            throw new Error('Invalid output payload');
                        }
                    }
                    context._success(data);
                }
                
                handler(context);
                
                
            } catch (error) {
                context.error(error.code || 'METHOD_ERROR', error.message);
            }
        });
        
        return this;
    }
    
    /**
    * Calls a method on another service via the broker
    * @param {string} method - Method name
    * @param {*} payload - Method payload
    * @param {CallOptions} [options={}] - Call options
    * @returns {Promise<*>} Method response
    */
    call(method, payload = null, options = {}) {
        const peer = options.query 
        ? { query: options.query, broadcast: options.broadcast }
        : true;
        
        return this.request(method, payload, {
            timeout: options.timeout,
            peer
        });
    }
    
    /**
    * Updates service status
    * @param {import('@broker-satellite/utils').ServiceStatus} status 
    * @param {Object} [metrics] - Additional metrics
    */
    updateStatus(status, metrics = {}) {
        this._status = status;
        this._manifest.updateStatus(status, metrics);
        
        // Notify broker of status change
        this.notify('service:status', {
            status,
            metrics
        });
    }
    
    /**
    * @private
    */
    _setupInternalMethods() {
        // Handle manifest requests from broker
        this.method('service:manifest', async (context) => {
            context.success({
                manifest: this._manifest._manifest
            });
        });
        
        // Handle health checks from broker
        this.method('service:health', async (context) => {
            context.success(this._manifest.getHealth());
        });
    }

    /**
     * @private
     */
    _setupInternalTopics() {
        // Listen to service status changes from broker
        this.on('service:status', ({data}) => {
            this._status = data.status;
        });
    }


    /**
     * 
     */
    
    /**
    * Gets current service status
    */
    get status() {
        return this._status;
    }
    
    /**
    * Gets service manifest
    */
    get manifest() {
        return this._manifest;
    }
}