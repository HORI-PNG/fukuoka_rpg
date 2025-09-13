// カードの絵柄（今回は絵文字で代用）
const cardData = ['🍌', '🍛', '🚂', '🏛️', '🚢', '🌉'];

// ゲームボードの要素を取得
const gameBoard = document.querySelector('.game-board');
const resultArea = document.querySelector('.result-area');

let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false; // ボードをロックして、3枚以上めくれないようにする
let matchedPairs = 0;

// カードをシャッフルしてボードに配置する関数
function initializeGame() {
    // カードのペアを作成し、シャッフル
    const shuffledCards = [...cardData, ...cardData].sort(() => Math.random() - 0.5);

    shuffledCards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.textContent = emoji; // 最初は見えないが、CSSで裏返すための準備
        
        // CSSで初期状態は裏向きにするため、文字を透明に
        card.style.color = 'transparent';

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// カードをめくる処理
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // 同じカードを2回クリックさせない

    this.classList.add('flip');
    this.style.color = 'white'; // めくったら絵文字を表示

    if (!hasFlippedCard) {
        // 1枚目のカード
        hasFlippedCard = true;
        firstCard = this;
    } else {
        // 2枚目のカード
        hasFlippedCard = false;
        secondCard = this;
        checkForMatch();
    }
}

// 2枚のカードが一致するかチェック
function checkForMatch() {
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        // 一致した場合
        disableCards();
    } else {
        // 不一致の場合
        unflipCards();
    }
}

// 一致したカードを無効化
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    
    matchedPairs++;
    // 全てのペアが揃ったらクリア
    if (matchedPairs === cardData.length) {
        showResult();
    }
}

// 不一致のカードを裏返す
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        firstCard.style.color = 'transparent';
        secondCard.style.color = 'transparent';
        resetBoard();
    }, 1000); // 1秒後に裏返す
}

// ボードの状態をリセット
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// クリア画面を表示
function showResult() {
    resultArea.style.display = 'block';
    const backButton = document.getElementById('back-to-map');
    
    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        // ★重要：URLパラメータを付けてマップ画面に戻る
        window.location.href = '../../index.html?reward=焼きカレー';
    });
}

// ゲームを開始
initializeGame();