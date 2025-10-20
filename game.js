import { GameScene } from './src/scenes/GameScene.js';
import { QuizScene } from './src/scenes/QuizScene.js';

// --- スコア管理 ---
function getScores() {
    const scores = localStorage.getItem('gameScores');
    return scores ? JSON.parse(scores) : {};
}

// --- Phaser ゲーム設定 ---
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false 
        }
    },
    scene: [GameScene, QuizScene]
};

// --- ゲーム起動処理 ---
const game = new Phaser.Game(config);

/**
 * ゲームを開始し、UIをセットアップする関数
 * @param {string} playerName - ゲームを開始するプレイヤー名
 */
function setupGame(playerName) {
    const scores = getScores();
    sessionStorage.setItem('currentPlayer', playerName);

    // UIの表示を更新
    document.getElementById('current-player').textContent = playerName;
    document.getElementById('current-score').textContent = scores[playerName] || 0;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-info').style.display = 'block';

    // リセットボタンのイベントリスナーを設定
    const resetButton = document.getElementById('reset-button');
    if (resetButton && !resetButton.dataset.listenerAttached) {
        resetButton.dataset.listenerAttached = 'true'; // 多重登録を防止
        resetButton.addEventListener('click', () => {
            const password = prompt('データを初期化します。パスワードを入力してください:');
            if (password === 'admin') {
                if (confirm('本当によろしいですか？全てのスコアとアイテムが削除されます。')) {
                    sessionStorage.clear();
                    localStorage.removeItem('gameScores');
                    localStorage.removeItem('playerItems');
                    alert('データを初期化しました。');
                    window.location.reload();
                }
            } else if (password !== null) {
                alert('パスワードが違います。');
            }
        });
    }
}

// --- UI操作 ---
window.addEventListener('load', () => {
    // ▼▼▼ ここからが重要 ▼▼▼
    // URLから報酬パラメータを取得し、セッションストレージに保存する
    const urlParams = new URLSearchParams(window.location.search);
    const reward = urlParams.get('reward');
    if (reward) {
        // 報酬を一時的に保存
        sessionStorage.setItem('pendingReward', reward);
        // URLからパラメータを削除して、リロード時に再度追加されるのを防ぐ
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    // ▲▲▲ ここまで ▲▲▲

    const currentPlayer = sessionStorage.getItem('currentPlayer');
    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');

    if (currentPlayer) {
        setupGame(currentPlayer);
    }

    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value;
        if (!playerName) {
            alert('プレイヤー名を入力してください。');
            return;
        }
        setupGame(playerName);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'e') {
            const itemBox = document.getElementById('item-box');
            itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
        }
    });
});