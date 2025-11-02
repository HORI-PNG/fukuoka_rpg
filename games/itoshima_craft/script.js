document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    const GAME_TIME = 20; // 制限時間（秒）
    const CLEAR_SCORE = 15; // クリアに必要なスコア
    const ITEM_SPAWN_INTERVAL = 800; // 0.8秒ごとにアイテム出現

    let score = 0;
    let timeLeft = GAME_TIME;
    let gameInProgress = true;
    let items = []; // {x, y, radius, color}
    let spawnTimer;
    let gameTimer;

    // --- 描画処理 ---
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        items.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.closePath();
        });
    }

    // --- アイテム（素材）の生成 ---
    function spawnItem() {
        if (!gameInProgress) return;

        const radius = 10 + Math.random() * 10; // 10〜20のランダムな大きさ
        const x = radius + Math.random() * (canvas.width - radius * 2);
        const y = radius + Math.random() * (canvas.height - radius * 2);
        
        // 貝殻（白っぽい）か流木（茶色っぽい）
        const color = Math.random() > 0.5 ? '#f5f5f5' : '#8d6e63'; 

        items.push({ x, y, radius, color });
    }

    // --- クリック処理 ---
    canvas.addEventListener('click', (e) => {
        if (!gameInProgress) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // クリックがアイテムに当たったか判定（後ろのアイテムからチェック）
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            const distance = Math.sqrt((clickX - item.x) ** 2 + (clickY - item.y) ** 2);
            
            if (distance < item.radius) {
                // ヒット！
                items.splice(i, 1); // アイテムを削除
                score++;
                scoreElement.textContent = score;
                return; // 1回のクリックで1アイテムのみ
            }
        }
    });

    // --- ゲームの更新（描画と時間）---
    function updateGame() {
        if (!gameInProgress) return;
        draw();
        requestAnimationFrame(updateGame);
    }

    function countdown() {
        if (!gameInProgress) return;

        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }

    // --- ゲーム終了処理 ---
    function endGame() {
        gameInProgress = false;
        clearInterval(spawnTimer);
        clearInterval(gameTimer);

        if (score >= CLEAR_SCORE) {
            // クリア
            resultArea.style.display = 'block';
        } else {
            // 失敗
            alert('残念！素材が集まらなかった...\nもう一度挑戦しよう！');
            window.location.reload();
        }
    }
    
    // マップに戻るボタン
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=手作りブレスレット&success=true';
    });

    // --- ゲーム開始 ---
    gameTimer = setInterval(countdown, 1000);
    spawnTimer = setInterval(spawnItem, ITEM_SPAWN_INTERVAL);
    updateGame(); // 描画ループを開始
});