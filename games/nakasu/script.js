document.addEventListener('DOMContentLoaded', () => {
    const orderText = document.getElementById('order-text');
    const timerBar = document.getElementById('customer-timer-bar');
    const ingredientButtons = document.querySelectorAll('.ingredient-btn');
    const bowlToppings = {
        soup: document.getElementById('topping-soup'),
        noodles: document.getElementById('topping-noodles'),
        chashu: document.getElementById('topping-chashu'),
        negi: document.getElementById('topping-negi')
    };
    const scoreElement = document.getElementById('score');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const CLEAR_SCORE = 3; // 3杯作ったらクリア
    const FULL_TIME = 8000; // 制限時間 (8秒)

    let currentOrder = []; // 現在の注文 (例: ['soup', 'noodles', 'chashu', 'negi'])
    let playerInput = []; // プレイヤーが入れた具材
    let score = 0;
    let gameInProgress = true;
    let customerTimer;
    let timeLeft = FULL_TIME;

    // --- ゲームのロジック ---

    // 1. 新しい注文を生成
    function createOrder() {
        // どんぶりの中身をリセット
        playerInput = [];
        Object.values(bowlToppings).forEach(t => t.classList.remove('visible'));

        // ★修正：注文内容（入れる順番）をランダム化
        const ingredients = ['soup', 'noodles', 'chashu', 'negi'];
        
        // 配列をシャッフル（フィッシャー・イェーツのシャッフル）
        for (let i = ingredients.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ingredients[i], ingredients[j]] = [ingredients[j], ingredients[i]];
        }
        currentOrder = ingredients;
        // ★修正ここまで
        
        // 注文を表示
        updateOrderText();

        // タイマースタート
        timeLeft = FULL_TIME;
        timerBar.style.width = '100%';
        timerBar.style.backgroundColor = '#4caf50';
        
        // タイマー処理（古いタイマーを止めてから新しいタイマーを起動）
        clearInterval(customerTimer);
        customerTimer = setInterval(updateTimer, 100);
    }

    // 2. 注文テキストを更新
    function updateOrderText() {
        // 次に入れるべき具材を強調表示
        const nextItemIndex = playerInput.length;
        let orderHtml = '注文: ';
        currentOrder.forEach((item, index) => {
            if (index === nextItemIndex) {
                orderHtml += `<strong style="color: red;">${translateItemName(item)}</strong> `;
            } else {
                orderHtml += `<span style="text-decoration: line-through;">${translateItemName(item)}</span> `;
            }
        });
        orderText.innerHTML = orderHtml;
    }

    // 3. 具材ボタンが押された時の処理
    function handleIngredientClick(e) {
        if (!gameInProgress) return;

        const selectedItem = e.target.dataset.item;
        
        // どんぶりに具材を表示
        if (bowlToppings[selectedItem]) {
            bowlToppings[selectedItem].classList.add('visible');
        }

        // 順番が合っているかチェック
        const nextItemIndex = playerInput.length;
        if (currentOrder[nextItemIndex] === selectedItem) {
            // 正解
            playerInput.push(selectedItem);
            updateOrderText();

            // 注文が完成したかチェック
            if (playerInput.length === currentOrder.length) {
                completeOrder();
            }
        } else {
            // 不正解 (順番が違う)
            gameOver('順番が違う！お客さんが怒って帰った！');
        }
    }

    // 4. 注文完成
    function completeOrder() {
        score++;
        scoreElement.textContent = score;

        if (score >= CLEAR_SCORE) {
            // ゲームクリア
            gameInProgress = false;
            clearInterval(customerTimer);
            resultArea.style.display = 'block';
        } else {
            // 次の注文へ
            createOrder();
        }
    }

    // 5. タイマー更新
    function updateTimer() {
        timeLeft -= 100;
        const widthPercent = (timeLeft / FULL_TIME) * 100;
        timerBar.style.width = `${widthPercent}%`;

        if (widthPercent < 30) {
            timerBar.style.backgroundColor = '#f44336'; // 赤色
        }

        if (timeLeft <= 0) {
            gameOver('時間切れ！お客さんが怒って帰った！');
        }
    }

    // 6. ゲームオーバー処理
    function gameOver(message) {
        gameInProgress = false;
        clearInterval(customerTimer);
        alert(message + '\nもう一度挑戦！');
        window.location.reload();
    }
    
    // --- 補助関数 ---
    function translateItemName(item) {
        switch (item) {
            case 'soup': return 'スープ';
            case 'noodles': return '麺';
            case 'chashu': return 'チャーシュー';
            case 'negi': return 'ネギ';
            default: return item;
        }
    }

    // --- イベントリスナー ---
    ingredientButtons.forEach(button => {
        button.addEventListener('click', handleIngredientClick);
        // ★スマホ対応：touchstartイベントも追加
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // クリックイベントの重複発火を防ぐ
            handleIngredientClick(e);
        });
    });

    backButton.addEventListener('click', () => {
        // spots.js の報酬名に合わせる
        window.location.href = '../../index.html?reward=ラーメン&success=true';
    });

    // --- ゲーム開始 ---
    createOrder();
});