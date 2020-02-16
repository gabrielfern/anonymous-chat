const cacheName = 'anonnchat-v2'
const files = [
    '/',
    '/socket.io/socket.io.js',
    '/icon.png',
    '/icon2.png'
]

self.oninstall = ev => {
    ev.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(files)
        })
    )
}

self.onactivate = () => {
    caches.keys().then(keys => {
        for (let key of keys) {
            if (key != cacheName)
                caches.delete(key)
        }
    })
}

self.onfetch = ev => {
    const url = new URL(ev.request.url)
    if (files.includes(url.pathname)) {
        ev.respondWith(
            caches.open(cacheName).then(cache => {
                cache.add(url.pathname)
                return cache.match(url.pathname)
            })
        )
    }
}

self.onnotificationclick = ev => {
    ev.notification.close()
    ev.waitUntil(
        clients.matchAll({ type: "window" }).then(clients => {
            return clients[0].focus()
        })
    )
}
