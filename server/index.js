const keys = require("./keys")

//  Express setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

//  Postgres client setup
const { Pool } = require('pg')
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
})
pgClient.on('error', () => console.log('lost PG connection'))

pgClient.on('connect', (client) => {
  console.log('connected to postgres')

  client.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err))
})

//  Redis client setup
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})
redisClient.on('connect', () => console.log('connected to redis'))
const redisPublisher = redisClient.duplicate()


//  Express route handlers
app.get('/', (_req, res) => {
  res.send('hello world')
})

app.get('/values/all', async (_req, res) => {
  const values = await pgClient.query('SELECT * from values')

  res.send(values.rows)
})

app.get('/values/current', async (_req, res) => {
  redisClient.hgetall('values', (_err, values) => {
    res.send(values)
  })
})

app.post('/values', async (req, res) => {
  const index = req.body.index

  if (parseInt(index) > 40) {
    return res.status(422).send('index not supported')
  }

  redisClient.hset('values', index, 'nothing yet')

  redisPublisher.publish('insert', index)

  pgClient.query('INSERT INTO values(number) VALUES ($1)', [index])

  res.send({
    working: true
  })
})

app.listen(5000, _err => {
  console.log('listening')
})