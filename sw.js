let cacheName = 'anonnchat-v1'
let files = [
    '/index.html',
    '/socket.io/socket.io.js',
    '/icon.png'
]

self.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName).then(cache => {
        return cache.addAll(files)
    }))
})

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(cacheRes => {
        return cacheRes || fetch(event.request).then(res => {
            return caches.open(cacheName).then(cache => {
                cache.put(event.request, res.clone())
                return res
            })
        })
    }))
})
