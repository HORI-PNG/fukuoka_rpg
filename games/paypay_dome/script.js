const swingButton = document.getElementById('swing-button');
const timingBar = document.getElementById('timing-bar');
const timingMarker = document.getElementById('timing-marker');
const resultArea = document.querySelector('.result-area');
const backButton = document.getElementById('back-to-map');

let gameInProgress = true; // ゲーム実行中フラグ

// スイングボタンが押されたときの処理
swingButton.addEventListener('click', () => {
    if (!gameInProgress) return; // ゲーム終了後は何もしない

    // タイミングバーの現在位置を取得
    const barRect = timingBar.getBoundingClientRect();
    const containerRect = timingBar.parentElement.getBoundingClientRect();
    const barLeft = barRect.left - containerRect.left;

    // マーカーの位置を取得
    const markerLeft = timingMarker.offsetLeft;
    const markerWidth = timingMarker.offsetWidth;

    // 当たり判定
    // (バーの位置がマーカーの範囲内に入っているか)
    if (barLeft >= markerLeft && barLeft <= (markerLeft + markerWidth)) {
        // 成功
        gameInProgress = false; // ゲームを停止
        timingBar.style.animationPlayState = 'paused'; // アニメーションを停止
        showResult(true);
    } else {
        // 失敗
        alert('空振り！もう一度！');
    }
});

// 結果を表示する関数
function showResult(success) {
    if (success) {
        resultArea.style.display = 'block';
    }
    // 失敗時の処理もここに追加できます（今回は成功時のみ表示）
}

// マップに戻るボタンの処理
backButton.addEventListener('click', () => {
    // ★重要：報酬と成功フラグを付けてマップ画面に戻る
    window.location.href = '../../index.html?reward=ホームラン記念ボール&success=true';
});