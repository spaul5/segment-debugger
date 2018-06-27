const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const server = http.createServer(app)
const io = require('socket.io')(server)
const { getClient } = require('./redis-client')
const port = 3000

var socket = null
var client = null
var corsOptions = {
	origin: 'http://localhost:4200',
	credentials: true
}
app.use(cors(corsOptions))


app.get('/api?', (req, res) => {
    switch(req.query.action) {
    	case 'subscribe':
    		subscribeToEvents(res)
    		handleMessages()
    		handleError()
    		break
    	case 'unsubscribe':
    		unsubscribeToEvents(res)
    		break
    	default:
    		res.send({ status: 'error', info: 'Unknown action' })
    }
})

client = getClient()

io.on('connection', (socketInstance) => {
	socket = socketInstance
    console.log('user connected')

    socket.on('disconnect', function() {
        console.log('user disconnected')
    })

    io.emit('message', { status: 'ok', info: 'connected to socket' })
})

function subscribeToEvents(res) {
	console.log('subscribing to events')
	client.subscribe('events', (err, count) => {
		if (err) {
			let errMsg = 'Failed subscribing to events stream'
			console.log(errMsg, err)
			res.send({ status: 'error', info: errMsg })
			return
		} else {
			res.send({ status: 'ok', info: 'successfully subscribed to redis stream'})
		}

		if (count !== 1) {
			console.log('Unexpected number of subscribed channels', count)
		}
	})
}

function unsubscribeToEvents(res) {
	console.log('unsubscribing to events')
	client.unsubscribe('events', (err, count) => {
		if (err) {
			let errMsg = 'Failed subscribing to events stream'
			console.log(errMsg, err)
			res.send({ status: 'error', info: errMsg })
			return
		}
		res.send({ status: 'ok', info: 'successfully unsubscribed to redis stream'})
		if (socket)
			socket.disconnect()
		return
	})
}

function handleMessages() {
	// check for same user doing same thing in the same second
	let prev = { userId: 'fake', sentAt: -1 }

	client.on('message', (channel, message) => {
		let newJson = JSON.parse(message)
		let newSentAt = (newJson.sentAt - (newJson.sentAt%1000))/1000
		if (prev.userId != newJson.userId && prev.sentAt != newSentAt) {
			io.emit('message', { status: 'ok', event: message, info: null })
		}
		prev = { anonymousId: newJson.userId, sentAt: newSentAt  }
	})
}

function handleError() {
	client.on('error', (err) => {
		console.log('redis err:', err)
		io.emit('message', { status: 'error', info: 'Error in redis client' })
	})
}

server.listen(port, () => {
    console.log('Express app listening on port 3000')
})