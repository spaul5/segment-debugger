const Redis = require('ioredis')
const client = new Redis()

exports.getClient = () => client