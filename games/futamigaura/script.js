document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('timing-cursor');
    const marker = document.getElementById('timing-marker');
    const barContainer = document.getElementById('game-container');
    const successCountElem = document.getElementById('success-count');
    const missCountElem = document.getElementById('miss-count');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    let successCount = 0;
    let missCount = 0;
    const SUCCESS_GOAL = 5; // 5回成功でクリア
    const MISS_LIMIT = 3;   // 3回失敗でゲームオーバー

    let gameInProgress = true;
    let canPress = true; // 1回の波で1回だけ押せるようにするフラグ

    // スペースキーが押されたときの処理
    document.addEventListener('keydown', (e) => {
        // スペースキー以外、ゲーム終了後、またはフラグがfalseなら無視
        if (e.key !== ' ' || !gameInProgress || !canPress) return;

        // 押せなくする
        canPress = false;

        // 1. 波（カーソル）の現在位置を取得
        const cursorRect = cursor.getBoundingClientRect();
        const containerRect = barContainer.getBoundingClientRect();
        const cursorLeft = cursorRect.left - containerRect.left;
        const cursorRight = cursorRect.right - containerRect.left;

        // 2. 夫婦岩（マーカー）の位置を取得
        const markerLeft = marker.offsetLeft;
        const markerRight = marker.offsetLeft + marker.offsetWidth;

        // 3. 当たり判定
        // (波の先端がマーカーに入った瞬間)
        if (cursorRight > markerLeft && cursorLeft < markerRight) {
            // 成功！
            successCount++;
            successCountElem.textContent = successCount;
            // 成功エフェクト
            marker.style.backgroundColor = '#81c784';
            setTimeout(() => { marker.style.backgroundColor = '#4caf50'; }, 200);

        } else {
            // 失敗
            missCount++;
            missCountElem.textContent = missCount;
            // 失敗エフェクト
            marker.style.backgroundColor = '#e57373';
            setTimeout(() => { marker.style.backgroundColor = '#4caf50'; }, 200);
        }

        // 4. 勝敗判定
        checkGameStatus();
    });

    // 波が画面外に出たら、再度押せるようにする
    cursor.addEventListener('animationiteration', () => {
        canPress = true; // アニメーションが1周したらリセット
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
            alert('ああっ、注連縄が切れた！やり直し！');
            window.location.reload();
        }
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=縁結びのお守り&success=true';
    });
});