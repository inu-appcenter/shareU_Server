const mockery = require('mockery')
const redis = require('./mocks/redis_mock')
const memcached = require('./mocks/memcached_mock')

mockery.registerMock('redis', redis)
mockery.registerMock('memcached', memcached)
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
})

const chai = require('chai')
const Kj = require('./../keyjson')

function redisInstance() {
    const kj = Kj()

    return kj.use(Kj.managers.redis())
}

describe('KeyJson', function() {
    describe('new istance', function() {
        it('should instanciate a new KeyJson instance', function() {
            chai.expect(Kj()).to.be.an.instanceof(Kj)
        })

        it('should response to methods: use, set, get, has, delete', function() {
            const kj = Kj()

            chai.expect(kj).to.respondTo('use')
            chai.expect(kj).to.respondTo('set')
            chai.expect(kj).to.respondTo('get')
            chai.expect(kj).to.respondTo('has')
            chai.expect(kj).to.respondTo('delete')
        })
    })

    describe('managers', function() {
        it('should change manager', function() {
            const kj = Kj()

            kj
            .use({test: 1})
            .use('key1', {test: 2})
            .use('key2', {test: 3})

            chai.assert.equal(kj.currentManager, 0)
            chai.assert.equal(kj.manager('key1').currentManager, 'key1')
            chai.assert.equal(kj.manager('key2').currentManager, 'key2')
        })
    })
})

describe('KeyJson managers', function() {
    describe('set and use', function() {
        it('should throw an error if manager key not exists', function() {
            const kj = Kj()

            chai.expect(() => {
                kj
                .use('key1', {test: 2})
                .manager('test')
            }).to.throw(Error);
        })

        it('should set in one manager and not in others', function(done) {
            const kj = Kj()

            kj
            .use('redis1', Kj.managers.redis())
            .use('redis2', Kj.managers.redis())
            .manager('redis1')
            .set('one', {foo: 'bar'})
            .has('one', (err, exists) => {
                chai.assert.isOk(exists)
                kj
                .manager('redis2')
                .has('two', (err, exists) => {
                    chai.assert.isNotOk(exists)
                    done()
                })
            })
        })
    })
})

describe('KeyJson Redis Store', function() {
    describe('crud', function() {
        it('should set a new json object', function(done) {
            redisInstance()
            .set('foo', {foo: 'bar'})
            .has('foo', (err, exists) => {
                chai.assert.isOk(exists)
                done()
            })
        })

        it('should get a stored object', function(done) {
            redisInstance()
            .set('foo', {foo: 'bar'})
            .get('foo', (err, json) => {
                chai.expect(json).to.be.an('object');
                chai.expect(json).to.include.keys('foo');
                done()
            })
        })

        it('should set a new json object with expiry', function(done) {
            redisInstance()
            .set('foo', {foo: 'bar'}, 120)
            .has('foo', (err, exists) => {
                chai.assert.isOk(exists)
                done()
            })
        })

        it('should delete a key', function(done) {
            const kj = redisInstance()

            kj
            .set('foo', {foo: 'bar'})
            .delete('foo', (err, result) => {
                chai.assert.isOk(result)

                kj
                .get('foo', (err, json) => {
                    chai.assert.isNotOk(json)
                    done()
                })
            })
        })
    })
})

function memcachedInstance() {
    const kj = Kj()

    return kj.use(Kj.managers.memcached())
}

describe('KeyJson Memcached Store', function() {
    describe('crud', function() {
        it('should set a new json object', function(done) {
            memcachedInstance()
            .set('foo', {foo: 'bar'})
            .has('foo', (err, exists) => {
                chai.assert.isOk(exists)
                done()
            })
        })

        it('should set a new json object with expiry', function(done) {
            memcachedInstance()
            .set('foo', {foo: 'bar'}, 120)
            .has('foo', (err, exists) => {
                chai.assert.isOk(exists)
                done()
            })
        })

        it('should get a stored object', function(done) {
            memcachedInstance()
            .set('foo', {foo: 'bar'})
            .get('foo', (err, json) => {
                chai.expect(json).to.be.an('object');
                chai.expect(json).to.include.keys('foo');
                done()
            })
        })

        it('should delete a key', function(done) {
            const kj = memcachedInstance()

            kj
            .set('foo', {foo: 'bar'})
            .delete('foo', (err, result) => {
                chai.assert.isOk(result)

                kj
                .get('foo', (err, json) => {
                    chai.assert.isNotOk(json)
                    done()
                })
            })
        })
    })
})
