import { GameScene } from './src/scenes/GameScene.js';
import { QuizScene } from './src/scenes/QuizScene.js';

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

// --- ゲームの自動起動 ---
// ▼▼▼ スタートボタンの処理を削除し、直接ゲームを起動するように変更 ▼▼▼
const game = new Phaser.Game(config);

// BGMを再生
const bgm = document.getElementById('bgm');
if (bgm) {
    // ブラウザの仕様により、ユーザーが一度画面をクリックするまで音声が再生されない場合があります
    document.body.addEventListener('click', () => {
        if(bgm.paused) {
            bgm.play().catch(e => console.error("BGMの再生に失敗:", e));
        }
    }, { once: true });
}

// リセットボタンの処理 (変更なし)
const resetButton = document.getElementById('reset-button');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        if (confirm('訪問履歴をリセットしますか？')) {
            sessionStorage.clear();
            window.location.reload();
        }
    });
}

// アイテムボックスの表示切り替え (Eキー) (変更なし)
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e') {
        const itemBox = document.getElementById('item-box');
        itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
    }
});