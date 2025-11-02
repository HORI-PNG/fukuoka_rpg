document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('timing-cursor');
    const marker = document.getElementById('timing-marker');
    const barContainer = document.getElementById('timing-bar-container');
    const successCountElem = document.getElementById('success-count');
    const missCountElem = document.getElementById('miss-count');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    let successCount = 0;
    let missCount = 0;
    const SUCCESS_GOAL = 5; // 5回成功でクリア
    const MISS_LIMIT = 3;   // 3回失敗でゲームオーバー

    let gameInProgress = true;

    // スペースキーが押されたときの処理
    document.addEventListener('keydown', (e) => {
        if (e.key !== ' ' || !gameInProgress) return;

        // 1. カーソルの現在位置を取得
        const cursorRect = cursor.getBoundingClientRect();
        const containerRect = barContainer.getBoundingClientRect();
        const cursorLeft = cursorRect.left - containerRect.left;

        // 2. マーカー（成功エリア）の位置を取得
        const markerLeft = marker.offsetLeft;
        const markerRight = marker.offsetLeft + marker.offsetWidth;

        // 3. 当たり判定
        if (cursorLeft >= markerLeft && cursorLeft <= markerRight) {
            // 成功！
            successCount++;
            successCountElem.textContent = successCount;
            
            // 少し難易度を上げる（アニメーション速度を速くする）
            cursor.style.animationDuration = (1.5 - successCount * 0.1) + 's';

        } else {
            // 失敗（早すぎるか遅すぎる）
            missCount++;
            missCountElem.textContent = missCount;
        }

        // 4. 勝敗判定
        checkGameStatus();
    });

    function checkGameStatus() {
        if (successCount >= SUCCESS_GOAL) {
            // クリア
            gameInProgress = false;
            cursor.style.animationPlayState = 'paused'; // アニメーション停止
            resultArea.style.display = 'block';

        } else if (missCount >= MISS_LIMIT) {
            // ゲームオーバー
            gameInProgress = false;
            cursor.style.animationPlayState = 'paused'; // アニメーション停止
            alert('舟がぶつかった！やり直し！');
            window.location.reload();
        }
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=うなぎのせいろ蒸し&success=true';
    });
});