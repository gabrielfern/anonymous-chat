const fs = require('fs')
const server = require('http').createServer()
const io = require('socket.io')(server, {
    pingInterval: 6000,
    pingTimeout: 4000
})

let html = fs.readFileSync('index.html')
let manifest = fs.readFileSync('manifest.json')
let icon = fs.readFileSync('icon.png')
let icon2 = fs.readFileSync('icon2.png')
let sw = fs.readFileSync('sw.js')

server.listen(process.env.PORT || 3000)
server.on('request', (req, res) => {
    if (req.url == '/' || req.url == '/index.html') {
        res.setHeader('Content-Type', 'text/html')
        res.end(html)
    } else if (req.url == '/manifest.json') {
        res.end(manifest)
    } else if (req.url == '/icon.png') {
        res.end(icon)
    } else if (req.url == '/icon2.png') {
        res.end(icon2)
    } else if (req.url == '/sw.js') {
        res.setHeader('Content-Type', 'text/javascript')
        res.end(sw)
    } else if (!req.url.startsWith('/socket.io')) {
        res.statusCode = 404
        res.end()
    }
})

function notifyOnlineCount() {
    io.clients((err, clients) => {
        if (err) throw err
        io.emit('online-count', clients.length)
    })
}

io.on('connection', socket => {
    notifyOnlineCount()

    socket.on('message', message => {
        socket.broadcast.emit('message', message)
    })

    socket.on('disconnect', () => {
        notifyOnlineCount()
    })
})
