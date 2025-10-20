import { GameScene } from './src/scenes/GameScene.js';
import { QuizScene } from './src/scenes/QuizScene.js';

// --- Phaser ゲーム設定 ---
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [GameScene, QuizScene]
};

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_AExrSSQwr2T3h1JjNseMzO3j1MTiJLnqDCYJkvxT5dukoY007kje9x1D_fx25kJWQQ/exec';

let currentPlayer = {
    userId: null,
    name: '名無し',
    score: 0,
    items: []
};

function getPlayerId() {
    let userId = localStorage.getItem('fukuokaRpgUserId');
    if (!userId) {
        userId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('fukuokaRpgUserId', userId);
    }
    return userId;
}

async function getPlayerData(userId) {
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getPlayer&userId=${userId}`);
        const result = await response.json();
        if (result.status === 'success' && result.data) {
            return result.data;
        }
        return null;
    } catch (error) {
        console.error('プレイヤーデータの取得に失敗:', error);
        return null;
    }
}

async function savePlayerData(player) {
    try {
        await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            // mode: 'no-cors' を削除
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Content-Typeを修正
            body: JSON.stringify({ action: 'updatePlayer', ...player })
        });
    } catch (error) {
        console.error('プレイヤーデータの保存に失敗:', error);
    }
}

async function setupGame(playerName) {
    document.getElementById('current-player').textContent = playerName;
    document.getElementById('current-score').textContent = currentPlayer.score;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-info').style.display = 'block';

    if (currentPlayer.name !== playerName) {
        currentPlayer.name = playerName;
        await savePlayerData(currentPlayer);
    }
    
    // Phaserゲームを起動
    const game = new Phaser.Game(config);
}

window.addEventListener('load', async () => {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');

    // --- 最初にすべてのボタンやキーの機能を設定 ---
    
    // リセットボタンの機能
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('本当にすべてのデータをリセットしますか？')) {
                localStorage.removeItem('fukuokaRpgUserId');
                window.location.reload();
            }
        });
    }

    // Eキーでアイテムボックスを開く機能
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'e') {
            const itemBox = document.getElementById('item-box');
            if(itemBox) {
                itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
            }
        }
    });

    // --- プレイヤーIDをチェックして処理を分岐 ---
    let userId = localStorage.getItem('fukuokaRpgUserId');
    
    if (userId) {
        // 【2回目以降のプレイヤーの場合】
        startScreen.style.display = 'none'; // スタート画面を即座に隠す
        
        const savedData = await getPlayerData(userId);
        if (savedData) {
            currentPlayer = { ...currentPlayer, ...savedData };
            currentPlayer.userId = userId;
            setupGame(currentPlayer.name); // 取得した名前で直接ゲームを開始
        } else {
            // もしIDはあるのにデータが取得できない場合は、スタート画面に戻す
            startScreen.style.display = 'flex';
        }

    } else {
        // 【新規プレイヤーの場合】
        startScreen.style.display = 'flex'; // スタート画面を表示
    }

    // スタートボタンがクリックされたときの処理（新規プレイヤー向け）
    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value;
        if (!playerName) {
            alert('プレイヤー名を入力してください。');
            return;
        }
        // 新しいIDを発行してゲームを開始
        currentPlayer.userId = getPlayerId();
        setupGame(playerName);
    });
});

window.gameApi = {
    updateScore: async (points) => {
        currentPlayer.score += points;
        document.getElementById('current-score').textContent = currentPlayer.score;
        await savePlayerData(currentPlayer);
        return currentPlayer.score;
    },
    addItem: async (itemName) => {
        if (!currentPlayer.items.includes(itemName)) {
            currentPlayer.items.push(itemName);
            await savePlayerData(currentPlayer);
        }
    }
};