self.addEventListener('push', function(event) {
    let options = {
        body: 'リマインダー発動',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png'
    };

    if (event.data) {
        const data = event.data.json();
        options.body = data.message || options.body;
        options.title = data.title || 'シンプルリマインダー';

        if (data.url) {
            options.data = { url: data.url };
        }
    }

    // 通知を表示
    event.waitUntil(
        self.registration.showNotification(options.title || 'シンプルリマインダー', options)
    );
});

// 通知クリック時
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            self.clients.openWindow(event.notification.data.url)
        );
    }
});

// Service Workerのインストールイベント
self.addEventListener('install', function() {
    self.skipWaiting();
});

// Service Workerのアクティベートイベント
self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});
