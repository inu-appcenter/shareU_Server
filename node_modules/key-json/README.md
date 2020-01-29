# key-json :honeybee:

Key/Json Store with multiple interfaces

* [Install](#install)
* [Example](#example)
* [Managers](#managers)
* [API](#api)

<a name="install"></a>
## Install

To install key-json, simply use npm:

```
npm install key-json --save
```

<a name="example"></a>
## Example

```javascript
const Kj = require('key-json')

const kj = Kj({
	loggerLevel: 'info'
})

kj
//default manager
.use(Kj.managers.redis({
	//redis createClient() configuration
	host: '127.0.0.1',
	port: 6379
}))
.use('memcached', Kj.managers.memcached('localhost:11211', {
	retries:10,
	retry:10000,
	remove:true,
}))
.set('foo', { foo: 'foo' }, (err) => {
})
.get('foo', (err, json) => {
})
.has('foo', (err, exists) => {
})
.delete('foo', (err, done) => {
})
.manager('memcached')
//set bar key in the memcached manager
.set('bar', { bar: 'bar' }, (err) => {
})
```

<a name="managers"></a>
## Managers

A Manager is an abstraction layer between **key-json** and storage systems. Currently there are two available managers

* Redis
* Memcached

<a name="api"></a>
## API

  * <a href="#constructor"><code><b>Kj()</b></code></a>
  * <a href="#use"><code>instance.<b>use()</b></code></a>
  * <a href="#manager"><code>instance.<b>manager()</b></code></a>
  * <a href="#set"><code>instance.<b>set()</b></code></a>
  * <a href="#get"><code>instance.<b>get()</b></code></a>
  * <a href="#has"><code>instance.<b>has()</b></code></a>
  * <a href="#delete"><code>instance.<b>delete()</b></code></a>

-------------------------------------------------------
<a name="constructor"></a>
### Kj([opts])

Creates a new instance of KeyJson.

Options are:

* `loggerLevel`: ['info', 'warn', 'error', 'fatal']

-------------------------------------------------------
<a name="use"></a>
### instance.use([key, ] manager)

Set a new manager configuration

* `key`, unique key for the manager
* `manager`, compatible manager interface

-------------------------------------------------------
<a name="manager"></a>
### instance.manager(key)

Switch to another manager by its key

* `key`, unique key for the manager

-------------------------------------------------------
<a name="set"></a>
### instance.set(key, json[, expiry, cb])

Store json in its key/value store

* `expiry` -> TTL for this key in seconds
* `cb` -> (error) => {}

-------------------------------------------------------
<a name="get"></a>
### instance.get(key, cb)

Get json by its key

* `cb` -> (err, json) => {}, json is already parsed

-------------------------------------------------------
<a name="has"></a>
### instance.has(key, cb)

Check if key is stored

* `cb` -> (err, exists) => {}, exists is a boolean

-------------------------------------------------------
<a name="delete"></a>
### instance.delete(key[, cb])

Delete key from the store

* `cb` -> (err, done) => {}, done is a boolean
