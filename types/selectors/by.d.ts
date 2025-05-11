export namespace by {
    /**
    * Selects service by exact name
    * @param {string} name Service name
    * @returns {SiftQuery} Sift query
    */
    export function name(name: string): SiftQuery;
    /**
    * Selects service by version or semver range
    * @param {string} version Version or range (e.g. ">=2.0.0")
    */
    export function version(version: string): import("sift").Query<{
        'manifest.version': {
            $regex: string;
        };
    }>;
    /**
    * Selects service by capability
    * @param {string|string[]} capabilities Required capabilities
    */
    export function capability(capabilities: string | string[]): import("sift").Query<{
        'manifest.capabilities': {
            $all: string[];
        };
    }>;
    /**
    * Selects service by tag
    * @param {string|string[]} tags Required tags
    */
    export function tag(tags: string | string[]): import("sift").Query<{
        'manifest.meta.tags': {
            $all: string[];
        };
    }>;
    /**
    * Selects service by region
    * @param {string} region Required region
    */
    export function region(region: string): import("sift").Query<{
        'manifest.meta.region': string;
    }>;
    export { query };
    /**
    * Matches services that satisfy all selectors (AND)
    * @param {Object[]} queries Array of sift queries
    */
    export function all(queries: any[]): import("sift").Query<{
        $and: any[];
    }>;
    /**
    * Matches services that satisfy any selector (OR)
    * @param {Object[]} queries Array of sift queries
    */
    export function any(queries: any[]): import("sift").Query<{
        $or: any[];
    }>;
    /**
    * Negates a query (NOT)
    * @param {Object} query Sift query to negate
    */
    export function not(query: any): any;
    /**
    * Matches services by method existence
    * @param {string} methodName Method name
    * @returns {Object} Sift query
    */
    export function method(methodName: string): any;
    /**
    * Matches healthy services (low error rate, good response time)
    * @param {Object} [criteria] Health criteria
    * @returns {Object} Sift query
    */
    export function healthy(criteria?: any): any;
}
export type InferredQuery<TItem extends unknown> = import("sift").Query<TItem>;
/**
* @template {*} TItem
* @typedef {import('sift').Query<TItem>} InferredQuery
*/
/**
* Custom sift query
* @template {*} TSchema
* @param {import('sift').Query<TSchema>} query
*/
declare function query<TSchema extends unknown>(query: import("sift").Query<TSchema>): import("sift").Query<TSchema>;
export {};
