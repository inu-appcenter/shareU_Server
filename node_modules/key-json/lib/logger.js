const pino = require('pino')

const Logger = {
    logger: pino({
        name: 'key-json',
    })
}

Logger.setLevel = function(level) {
    if (!level) return false

    const levels = ['info', 'warn', 'error', 'fatal']

    level = level.toLowerCase()

    if (levels.indexOf(level) != -1) {
        this.logger.level = level
    }
}

Logger.fatal = function (msg) {
    this.logger.fatal(msg)
}

Logger.error = function (msg) {
    this.logger.error(msg)
}

Logger.warn = function (msg) {
    this.logger.warn(msg)
}

Logger.info = function (msg) {
    this.logger.info(msg)
}

module.exports = Logger