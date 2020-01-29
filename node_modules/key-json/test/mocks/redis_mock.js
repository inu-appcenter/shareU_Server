'use strict'

function RedisClient() {
    this.db = {}
}

RedisClient.prototype.set = function(key, data, cb) {
    this.db[key] = data
    cb(null, 'OK')
}

RedisClient.prototype.get = function(key, cb) {
    cb(null, this.db[key])
}

RedisClient.prototype.exists = function(key, cb) {
    cb(null, this.db[key] ? '1' : '0')
}

RedisClient.prototype.del = function(key, cb) {
    if (this.db[key]) {
        delete this.db[key]
        return cb(null, '1')
    }

    cb(null, '0')
}

RedisClient.prototype.expire = function(key, time, cb) {

}

RedisClient.prototype.on = function(event, cb) {

}

module.exports = {
    createClient: function(opts) {
        return new RedisClient()
    }
}