/**
* @template {*} TItem
* @typedef {import('sift').Query<TItem>} InferredQuery
*/

/**
* Custom sift query
* @template {*} TSchema
* @param {import('sift').Query<TSchema>} query
*/
const query = (query) => query;

/**
* Service selection utilities that generate pure sift queries
*/
export const by = {
    /**
    * Selects service by exact name
    * @param {string} name Service name
    * @returns {SiftQuery} Sift query
    */
    name(name) {
        return query({
            'manifest.name': name
        })
    },
    
    /**
    * Selects service by version or semver range
    * @param {string} version Version or range (e.g. ">=2.0.0")
    */
    version(version) {
        return query({
            'manifest.version': {
                $regex: `^${version.replace(/[~^]/g, '')}`
            }
        })
    },
    
    /**
    * Selects service by capability
    * @param {string|string[]} capabilities Required capabilities
    */
    capability(capabilities) {
        const required = Array.isArray(capabilities) ? capabilities : [capabilities];
        return query({
            'manifest.capabilities': {
                $all: required
            }
        })
    },
    
    /**
    * Selects service by tag
    * @param {string|string[]} tags Required tags
    */
    tag(tags) {
        const required = Array.isArray(tags) ? tags : [tags];
        return query({
            'manifest.meta.tags': {
                $all: required
            }
        });
    },
    
    /**
    * Selects service by region
    * @param {string} region Required region
    */
    region(region) {
        return query({
            'manifest.meta.region': region
        });
    },
    
    query,
    
    /**
    * Matches services that satisfy all selectors (AND)
    * @param {Object[]} queries Array of sift queries
    */
    all(queries) {
        return query({
            $and: queries
        });
    },
    
    /**
    * Matches services that satisfy any selector (OR)
    * @param {Object[]} queries Array of sift queries
    */
    any(queries) {
        return query({
            $or: queries
        });
    },
    
    /**
    * Negates a query (NOT)
    * @param {Object} query Sift query to negate
    */
    not(query) {
        return query({
            $not: query
        });
    },
    
    /**
    * Matches services by method existence
    * @param {string} methodName Method name
    * @returns {Object} Sift query
    */
    method(methodName) {
        return query({
            'manifest.methods': {
                $elemMatch: {
                    name: methodName
                }
            }
        })
    },
    
    /**
    * Matches healthy services (low error rate, good response time)
    * @param {Object} [criteria] Health criteria
    * @returns {Object} Sift query
    */
    healthy(criteria = {}) {
        const { errorRate = 0.1, responseTime = 1000 } = criteria;
        return query({
            $and: [
                { 'metrics.errorRate': { $lt: errorRate } },
                { 'metrics.averageResponseTime': { $lt: responseTime } }
            ]
        });
    }
};