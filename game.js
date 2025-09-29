import { GameScene } from './src/scenes/GameScene.js'; // `GameScrene.js` は後で `GameScene.js` に名前変更します
import { QuizScene } from './src/scenes/QuizScene.js';

// --- スコア管理 ---
function getScores() {
    const scores = localStorage.getItem('gameScores');
    return scores ? JSON.parse(scores) : {};
}

// --- Phaser ゲーム設定 ---
const config = {
    type: Phaser.AUTO,
    parent: 'game-container', // このIDを持つdivの中にゲーム画面が作られる
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false 
        }
    },
    scene: [GameScene, QuizScene] // 使用するシーンを登録
};

// --- ゲーム起動処理 ---
const game = new Phaser.Game(config);

// --- UI操作 ---
window.addEventListener('load', () => {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const playerNameInput = document.getElementById('player-name');
    const bgm = document.getElementById('bgm');

    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value;
        if (!playerName) {
            alert('プレイヤー名を入力してください。');
            return;
        }

        // プレイヤー情報を保存・表示
        sessionStorage.setItem('currentPlayer', playerName);
        document.getElementById('current-player').textContent = playerName;
        const scores = getScores();
        document.getElementById('current-score').textContent = scores[playerName] || 0;
        
        // UIの表示切り替え
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        document.getElementById('game-info').style.display = 'block';
        
        // BGM再生（うるさいのでコメントアウト）
        // if (bgm) bgm.play();
    });

    // アイテムボックスの表示切り替え
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'e') {
            const itemBox = document.getElementById('item-box');
            itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
        }
    });
});