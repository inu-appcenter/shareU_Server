'use strict'

function MemcachedClient(server, opts) {
    this.db = {}
}

MemcachedClient.prototype.set = function(key, data, expiry, cb) {
    this.db[key] = data
    cb(null, true)
}

MemcachedClient.prototype.get = function(key, cb) {
    cb(null, this.db[key])
}

MemcachedClient.prototype.exists = function(key, cb) {
    cb(null, this.db[key] ? this.db[key] : undefined)
}

MemcachedClient.prototype.del = function(key, cb) {
    if (this.db[key]) {
        delete this.db[key]
        return cb(null, true)
    }

    cb(null, false)
}

MemcachedClient.prototype.touch = function(key, time, cb) {

}

MemcachedClient.prototype.on = function(event, cb) {

}

module.exports = MemcachedClient