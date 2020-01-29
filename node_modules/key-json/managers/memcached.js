const memcached = require('memcached')
const logger = require('./../lib/logger')

function Memcached(server, opts) {
    if (!(this instanceof Memcached)) {
        return new Memcached(server, opts)
    }

    this.client = new memcached(server, opts)

    this.setListeners(this.client)
}

Memcached.prototype.setListeners = function(client) {
    client.on('issue', (details) => {
        logger.warn(details)
    });

    client.on('failure', (details) => {
        logger.fatal(details)
    });

    client.on('reconnecting', (details) => {
        logger.warn(details)
    });

    client.on('reconnect', (details) => {
        logger.info(details)
    });

    client.on('remove', (details) => {
        logger.info(details)
    });
}

Memcached.prototype.set = function(key, json, expiry, cb) {
    this
    .client
    .set(key, JSON.stringify(json), expiry || 0, (err, reply) => {
        cb.call(this, err)
    })
}

Memcached.prototype.get = function(key, cb) {
    this
    .client
    .get(key, (err, reply) => {
        if (!err && reply) {
            reply = JSON.parse(reply)
        }
        cb.call(this, err, reply)
    })
}

Memcached.prototype.has = function(key, cb) {
    this
    .client
    .get(key, (err, reply) => {
        cb.call(this, err, (reply != undefined))
    })
}

Memcached.prototype.delete = function(key, cb) {
    this
    .client
    .del(key, (err, reply) => {
        cb.call(this, err, (reply == 1))
    })
}

Memcached.prototype.ttl = function(key, time, cb) {
    this
    .client
    .touch(key, time, (err) => {
        cb.call(this, err)
    })
}

module.exports = Memcached