const redis = require('redis')
const keys = require('./keys')

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

const sub = redisClient.duplicate()

const fibonacci = (index) => index < 2 ? 1 : fibonacci(index - 1) + fibonacci(index - 2)

const onMessage = (_channel, message) => redisClient.hset('values', message, fibonacci(parseInt(message)))
sub.on('message', onMessage)

sub.subscribe('insert')