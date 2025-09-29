import { GameScene } from './scenes/GameScene.js';
import { QuizScene } from './scenes/QuizScene.js';

// Phaserゲームの設定
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    },
    scene: [ GameScene, QuizScene ]
};

// --- UI と BGM の制御 ---
const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    const game = new Phaser.Game(config); // ゲームを起動
    
    const bgm = document.getElementById('bgm');
    if (bgm) {
        bgm.play().catch(e => console.error("BGMの再生に失敗:", e));
    }
});

// リセットボタンの処理
const resetButton = document.getElementById('reset-button');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        if (confirm('訪問履歴をリセットしますか？')) {
            sessionStorage.clear();
            window.location.reload();
        }
    });
}

// アイテムボックスの表示切り替え (Eキー)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
        const itemBox = document.getElementById('item-box');
        itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
    }
});