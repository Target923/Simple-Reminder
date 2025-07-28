// Service Workerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/Simple-Reminder/sw.js')
        .then(function(registration) {
            window.serviceWorkerRegistration = registration; // グローバル保存
        })
        .catch(function(error) {
            console.log('Service Worker 登録失敗:', error);
        });
    });
} else {
    console.log('お使いのブラウザはService Workerをサポートしていません');
}

// HTML要素取得
const minutesInput = document.getElementById('minutes');
const startTimeInput = document.getElementById('startTime');
const addReminderButton = document.getElementById('addReminder')
const removeReminderButton = document.getElementById('removeReminder')

let reminderIntervalId = null;
let startTimeoutId = null;

// 通知許可チェック関数
async function requestNotificationPermission() {
    // APIサポートチェック
    if (!('Notification' in window)) {
        alert('このブラウザは通知をサポートしていません');
        return 'unsupported';
    }

    // 既に許可/拒否されているか確認
    if (Notification.permission === 'granted') {
        console.log('通知は既に許可されています');
        return 'granted';
    }
    if (Notification.permission === 'denied') {
        console.log('通知は既に拒否されています')
        alert('通知が拒否されています。ブラウザの設定から通知を許可してください');
        return 'denied';
    }

    // まだ許可されていない場合、ユーザーに許可を求める
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        return 'granted';
    } else {
        alert('通知が拒否されました。リマインダー通知は表示されません');
        return 'denied';
    }
}

// アラーム関数（Service Worker経由）
async function triggerAlarm() {
    if (window.serviceWorkerRegistration) {
        try {
            // Service Workerにデータ送信
            await window.serviceWorkerRegistration.showNotification('リマインダー通知', {
                body: '時間になりました',
                icon: '/Tools/simple-reminder/icon-192x192.png',
                badge: '/Tools/simple-reminder/badge-72x72.png',
                data: {
                    url: 'https://target923.github.io/Tools/simple-reminder' // GitHub Pages
                }
            });
        } catch (error) {
            console.error(error);
            alert('トラブル発生: 詳細はエラーログをご確認ください');
        }
    } else {
        alert('リマインダーアラートを表示しています');
    }
}

// イベントリスナー
addReminderButton.addEventListener('click', async () => {
    if (reminderIntervalId !== null) {
        clearInterval(reminderIntervalId);
        reminderIntervalId = null;
    }
    if (startTimeoutId !== null) {
        clearTimeout(startTimeoutId);
        startTimeoutId = null;
    }

    // 通知の許可を求める
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
        return;
    }

    const minutes = parseFloat(minutesInput.value);
    const startTime = startTimeInput.value;

    // 入力値のバリデーション
    if (isNaN(minutes) || minutes <= 0) {
        alert('「何分毎」に有効な数値を入力してください');
        return;
    }
    if (!startTime) {
        alert('「開始時刻」を入力してください');
        return;
    }

    // 現在の日付オブジェクトを作成
    const now = new Date();
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const scheduledStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0)

    // 設定時刻が今の時間より過去なら、翌日の時刻に設定
    if (scheduledStartTime.getTime() < now.getTime()) {
        scheduledStartTime.setDate(scheduledStartTime.getDate() + 1);
    }

    // 開始時刻までのミリ秒を計算
    const delayUntilStartTime = scheduledStartTime.getTime() - now.getTime();

    // 開始時刻用のアラーム開始タイマー
    startTimeoutId = setTimeout(() => {
        triggerAlarm();

        // ミリ秒変換
        const intervalMilliseconds = minutes * 60 * 1000;

        reminderIntervalId = setInterval(() => {
            triggerAlarm();
        }, intervalMilliseconds);
    }, delayUntilStartTime);
    
    alert('リマインダーが設定されました');
});

removeReminderButton.addEventListener('click', () => {
    if (startTimeoutId !== null) {
        clearTimeout(startTimeoutId);
        startTimeoutId = null;
        alert('リマインダーを解除しました')
    } else {
        alert('リマインダー設定はありません')
    }

    if (reminderIntervalId !== null) {
        clearInterval(reminderIntervalId);
        reminderIntervalId = null;
    }
});