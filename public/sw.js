const CACHE_NAME = 'tasks-pwa-cache-v1';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/about.html',
    '/app.js',     
    '/styles.css',  
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Установка...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Кэширование файлов');
                return cache.addAll(ASSETS_TO_CACHE); // Скачиваем и сохраняем файлы
            })
    );
});


self.addEventListener('activate', (event) => {
    console.log('Service Worker: Активация...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Удаление старого кэша', cache);
                        return caches.delete(cache); // Удаляем старые версии
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) 
                {
                    return response;
                }
                return fetch(event.request);
            })
    );
});