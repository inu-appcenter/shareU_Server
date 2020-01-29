const crypto = require('crypto')
const logger = require('./lib/logger')

function KeyJson(opts) {
    if (!(this instanceof KeyJson)) {
        return new KeyJson(opts)
    }

    this.options = opts || {}
    this.currentManager = 0
    this.managers = {}

    logger.setLevel(this.options.loggerLevel)
}

KeyJson.prototype.use = function(key, manager) {
    if (typeof key == 'object') {
        this.managers[0] = key
    } else {
        this.managers[key] = manager
    }

    return this
}

KeyJson.prototype.manager = function(key) {
    if (!this.managers[key]) {
        throw new Error('Manager ' + key + ' does not exists')
    }

    this.currentManager = key

    return this
}

KeyJson.prototype.set = function(key, json, expiry, cb) {
    if (typeof expiry == 'function') {
        cb = expiry
        expiry = null
    }

    this
    .managers[this.currentManager]
    .set(key, json, expiry, (err) => {
        if (cb) cb.call(this, err)
    })

    return this
}

KeyJson.prototype.get = function(key, cb) {
    this
    .managers[this.currentManager]
    .get(key, (err, json) => {
        if (cb) cb.call(this, err, json)
    })

    return this
}

KeyJson.prototype.has = function(key, cb) {
    this
    .managers[this.currentManager]
    .has(key, (err, check) => {
        if (cb) cb.call(this, err, check)
    })

    return this
}

KeyJson.prototype.delete = function(key, cb) {
    this
    .managers[this.currentManager]
    .delete(key, (err, done) => {
        if (cb) cb.call(this, err, done)
    })

    return this
}

KeyJson.managers = {
    redis: require('./managers/redis'),
    memcached: require('./managers/memcached')
}

module.exports = KeyJson
