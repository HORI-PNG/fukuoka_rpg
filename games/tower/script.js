// HTML要素の取得
const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const resultArea = document.getElementById('result-area');
const resultMessage = document.getElementById('result-message');
const actionButton = document.getElementById('action-button');

// 単語リスト
const words = ['HAKATA', 'TENJIN', 'FUKUOKA', 'NAKASU', 'DAZAIFU', 'TOWER', 'MOMOCHI', 'MENTAIKO'];
const WINNING_SCORE = 8;
let score = 0;
let time = 30;
let isPlaying;

// イベントリスナー
wordInput.addEventListener('input', checkInput);

// ゲーム初期化
function init() {
    showWord();
    // 1秒ごとにタイマーを減らす
    setInterval(countdown, 1000);
}

// 単語を表示
function showWord() {
    const randIndex = Math.floor(Math.random() * words.length);
    wordDisplay.textContent = words[randIndex];
}

// 入力チェック
function checkInput() {
    if (wordInput.value.toUpperCase() === wordDisplay.textContent) {
        score++;
        scoreDisplay.textContent = score;
        wordInput.value = '';
        showWord();
    }
}

// カウントダウン
function countdown() {
    if (time > 0) {
        time--;
    } else if (time === 0) {
        checkGameStatus();
    }
    timeDisplay.textContent = time;
}

// ゲームの状態をチェック
function checkGameStatus() {
    if (score >= WINNING_SCORE) {
        resultMessage.textContent = 'クリア！展望室に到着！';
        actionButton.textContent = 'マップに戻る';
        actionButton.onclick = () => {
            window.location.href = '../../index.html?reward=明太子';
        };
    } else {
        resultMessage.textContent = '時間切れ...再挑戦！';
        actionButton.textContent = 'もう一度プレイ';
        actionButton.onclick = () => {
            window.location.reload();
        };
    }
    resultArea.style.display = 'block';
    wordInput.disabled = true; // 入力を無効化
}

init();