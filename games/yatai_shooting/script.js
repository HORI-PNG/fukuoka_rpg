const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const resultArea = document.querySelector('.result-area');

// 的の情報
const target = {
    x: Math.random() * (canvas.width - 30),
    y: Math.random() * (canvas.height - 30),
    radius: 15,
    dx: 2, // X方向の移動速度
    dy: -2 // Y方向の移動速度
};

function drawTarget() {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTarget();

    // 的を動かす
    target.x += target.dx;
    target.y += target.dy;

    // 壁での反射
    if (target.x + target.dx > canvas.width - target.radius || target.x + target.dx < target.radius) {
        target.dx = -target.dx;
    }
    if (target.y + target.dy > canvas.height - target.radius || target.y + target.dy < target.radius) {
        target.dy = -target.dy;
    }
    
    requestAnimationFrame(update);
}

// クリックイベント
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // クリック位置と的の中心の距離を計算
    const distance = Math.sqrt(
        (clickX - target.x) ** 2 + (clickY - target.y) ** 2
    );

    // 当たり判定
    if (distance < target.radius) {
        // ゲームクリア
        resultArea.style.display = 'block';
    }
});

// マップに戻るボタンの処理
const backButton = document.getElementById('back-to-map');
backButton.addEventListener('click', () => {
    // ★重要：URLパラメータを付けてマップ画面に戻る
    window.location.href = '../../index.html?reward=ラーメン';
});

// ゲーム開始
update();