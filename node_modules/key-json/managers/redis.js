const redis = require('redis')
const logger = require('./../lib/logger')

function Redis(opts) {
    if (!(this instanceof Redis)) {
        return new Redis(opts)
    }

    this.client = redis.createClient(opts)

    this.setListeners(this.client)
}

Redis.prototype.setListeners = function(client) {
    client.on('ready', () => {
        logger.info('Redis ready')
    })

    client.on('connect', () => {
        logger.info('Redis connected')
    })

    client.on('reconnecting', (info) => {
        logger.warn('Redis reconnecting delay: ' + info.delay + ' attempt: ' + info.attempt)
    })

    client.on('error', (err) => {
        logger.fatal(err)
    })

    client.on('end', () => {
        logger.info('Redis end')
    })

    client.on('warning', (warn) => {
        logger.warn(warn)
    })
}

Redis.prototype.set = function(key, json, expiry, cb) {
    this
    .client
    .set(key, JSON.stringify(json), (err, reply) => {
        if (expiry && !err) {
            this
            .ttl(key, expiry, (err) => {
                cb.call(this, err)
            })
        } else {
            cb.call(this, err)
        }
    })
}

Redis.prototype.get = function(key, cb) {
    this
    .client
    .get(key, (err, reply) => {
        if (!err && reply) {
            reply = JSON.parse(reply)
        }

        cb.call(this, err, reply)
    })
}

Redis.prototype.has = function(key, cb) {
    this
    .client
    .exists(key, (err, reply) => {
        cb.call(this, err, (reply == 1))
    })
}

Redis.prototype.delete = function(key, cb) {
    this
    .client
    .del(key, (err, reply) => {
        cb.call(this, err, (reply == 1))
    })
}

Redis.prototype.ttl = function(key, time, cb) {
    this
    .client
    .expire(key, time, (err) => {
        cb.call(this, err)
    })
}

module.exports = Redis
