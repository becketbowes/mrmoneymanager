//list files that should be accessible offline
const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js"
];

//name the service worker
const APP_PREFIX = 'mr$manager';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//cache the files for use if server is unavailable
self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('installing cache: ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

//look for existing caches by key, add self to active caches, delete unneccesary caches
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeepList.push(CACHE_NAME);
            return Promise.all(keyList.map(function(key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cache: ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    )
});

self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(request) {
            return request || fetch(e.request)
        })
    )
})