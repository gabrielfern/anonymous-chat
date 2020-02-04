const fs = require('fs')
const server = require('http').createServer()
const io = require('socket.io')(server)

let html
fs.readFile('index.html', (err, data) => {
    if (err) throw err;
    html = data
    server.listen(3000)
})

server.on('request', (req, res) => {
    if (req.url == '/' || req.url == '/index.html') {
        res.end(html)
    } else if (!req.url.startsWith('/socket.io')) {
        res.statusCode = 404
        res.end()
    }
})

function notifyOnlineCount() {
    io.clients((err, clients) => {
        io.emit('online-count', clients.length)
    })
}

io.on('connection', socket => {
    notifyOnlineCount()
    console.log('New client:', socket.id)

    socket.on('message', message => {
        console.log(message)
        socket.broadcast.emit('message', message)
    })

    socket.on('disconnect', () => {
        notifyOnlineCount()
    })
})
