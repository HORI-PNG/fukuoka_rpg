document.addEventListener('DOMContentLoaded', () => {
    const mistakeImageWrapper = document.getElementById('mistake-image-wrapper');
    const mistakeImage = document.getElementById('mistake-image');
    const foundCountElem = document.getElementById('found-count');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const TOTAL_MISTAKES = 2;
    let foundCount = 0;

    // (画像サイズ 400x225 を基準にした座標
    const mistakes = [
        { x: 65, y: 40, radius: 25, found: false }, // 仮座標1: 左上の月
        { x: 275, y: 220, radius: 25, found: false }  // 仮座標2: 右下の車
    ];


    // デバッグ
    // function drawDebugCircles() {
    //     mistakes.forEach(mistake => {
    //         const circle = document.createElement('div');
    //         circle.className = 'debug-circle';
            
    //         // mistakes 配列の x, y, radius を使って円のスタイルを設定
    //         circle.style.left = `${mistake.x}px`;
    //         circle.style.top = `${mistake.y}px`;
    //         circle.style.width = `${mistake.radius * 2}px`; // 直径
    //         circle.style.height = `${mistake.radius * 2}px`; // 直径
            
    //         mistakeImageWrapper.appendChild(circle);
    //     });
    // }

    // --- クリックまたはタップ時の処理 ---
    function handleInteraction(e) {
        if (foundCount >= TOTAL_MISTAKES) return; 

        const rect = mistakeImage.getBoundingClientRect();
        let clickX, clickY;

        if (e.type === 'click') {
            clickX = e.clientX - rect.left;
            clickY = e.clientY - rect.top;
        } else if (e.type === 'touchstart') {
            e.preventDefault(); 
            clickX = e.touches[0].clientX - rect.left;
            clickY = e.touches[0].clientY - rect.top;
        } else {
            return;
        }
        
        // 当たり判定
        for (const mistake of mistakes) {
            if (mistake.found) continue; 

            const distance = Math.sqrt((clickX - mistake.x) ** 2 + (clickY - mistake.y) ** 2);

            if (distance <= mistake.radius) {
                // 発見！
                mistake.found = true;
                foundCount++;
                foundCountElem.textContent = foundCount;
                
                showFeedbackText(clickX, clickY);

                // ★ デバッグ機能 ★ 見つけたら円を非表示にする
                const debugCircle = mistakeImageWrapper.querySelector(`.debug-circle[style*="left: ${mistake.x}px"]`);
                if (debugCircle) {
                    debugCircle.style.display = 'none';
                }

                if (foundCount === TOTAL_MISTAKES) {
                    setTimeout(showResult, 1000);
                }
                return; 
            }
        }
    }

    // 「間違いミッケ！」のテキストを表示する関数
    function showFeedbackText(x, y) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-text';
        feedback.textContent = '間違いミッケ！';
        feedback.style.left = `${x}px`;
        feedback.style.top = `${y}px`;
        
        mistakeImageWrapper.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    }

    function showResult() {
        resultArea.style.display = 'block';
    }

    // イベントリスナーを登録
    mistakeImageWrapper.addEventListener('click', handleInteraction);
    mistakeImageWrapper.addEventListener('touchstart', handleInteraction);

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=明太子&success=true';
    });

    // ★ デバッグ機能 ★ ページ読み込み時にデバッグ用の円を描画
    drawDebugCircles();
});