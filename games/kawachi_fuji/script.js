// HTMLの読み込みが完了してからゲームを開始する
document.addEventListener('DOMContentLoaded', () => {

    // カードデータ（6ペア = 12枚）
    const cardData = [
        { id: 'purple', name: '紫' },
        { id: 'pink', name: 'ピンク' },
        { id: 'white', name: '白' },
        { id: 'blue', name: '青' },
        { id: 'yellow', name: '黄' },
        { id: 'deep-purple', name: '濃紫' }
    ];

    const gameBoard = document.querySelector('.game-board');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;
    let matchedPairs = 0;

    function initializeGame() {
        gameBoard.innerHTML = ''; // ボードをクリア
        matchedPairs = 0;
        resetBoard();
        
        const shuffledCards = [...cardData, ...cardData].sort(() => Math.random() - 0.5);

        shuffledCards.forEach(data => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = data.id; // data-idに色のIDを設定
            
            // ★修正：カードに直接テキストを設定
            card.textContent = data.name;
            
            // ★修正：めくれた後の色を設定（背景用）
            card.classList.add(`card-${data.id}`);

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
        } else {
            hasFlippedCard = false;
            secondCard = this;
            checkForMatch();
        }
    }

    function checkForMatch() {
        if (firstCard.dataset.id === secondCard.dataset.id) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
        
        matchedPairs++;
        if (matchedPairs === cardData.length) {
            setTimeout(showResult, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function showResult() {
        resultArea.style.display = 'block';
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=藤のしおり&success=true';
    });

    // ゲームを開始
    initializeGame();

}); // DOMContentLoaded の閉じカッコ