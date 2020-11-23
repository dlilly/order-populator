const _ = require('lodash')

module.exports = {
    microservices: [{
        key: 'get-env-configuration',
        path: '/api/config',

        handle: async () => {
            return process.env
        }
    }]
}