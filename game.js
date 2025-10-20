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
let currentPlayer = null;

async function loginAndGetData(playerName) {
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getPlayer&name=${playerName}`);
        const result = await response.json();
        return (result.status === 'success' && result.data) ? result.data : null;
    } catch (error) {
        console.error('プレイヤーデータの取得に失敗:', error);
        return null;
    }
}

async function savePlayerData(player) {
    try {
        await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'updatePlayer', ...player })
        });
    } catch (error) {
        console.error('プレイヤーデータの保存に失敗:', error);
    }
}

function setupGame(playerData) {
    document.getElementById('current-player').textContent = playerData.name;
    document.getElementById('current-score').textContent = playerData.score;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-info').style.display = 'block';
    
    const game = new Phaser.Game(config);
}

window.addEventListener('load', () => {
    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');

    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('本当にすべてのデータをリセットし、ログイン画面に戻りますか？')) {
                // 現在のログイン情報を削除
                sessionStorage.removeItem('loggedInPlayer');
                // 念のため、古いバージョンのIDも削除
                localStorage.removeItem('fukuokaRpgUserId');
                
                // ページを再読み込みして、最初の状態に戻す
                window.location.reload();
            }
        });
    }

    const deleteButton = document.getElementById('delete-data-button');
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const player = window.gameApi.getCurrentPlayer();
            if (!player) {
                alert('プレイヤーがログインしていません。');
                return;
            }

            if (confirm(`本当にプレイヤー「${player.name}」のすべてのセーブデータをサーバーから削除しますか？\nこの操作は元に戻せません。`)) {
                try {
                    // サーバーに削除をリクエスト
                    await fetch(GAS_WEB_APP_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify({ action: 'deletePlayer', name: player.name })
                    });
                    
                    alert(`プレイヤー「${player.name}」のデータを完全に削除しました。`);
                    
                    // 端末のログイン情報もクリアして、ページをリロード
                    sessionStorage.removeItem('loggedInPlayer');
                    window.location.reload();

                } catch (error) {
                    console.error('データの削除に失敗しました:', error);
                    alert('データの削除中にエラーが発生しました。');
                }
            }
        });
    }

    startButton.addEventListener('click', async () => {
        const playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('プレイヤー名を入力してください。');
            return;
        }

        startButton.disabled = true;
        startButton.textContent = 'ロード中...';

        let playerData = await loginAndGetData(playerName);

        if (!playerData) {
            // 新規プレイヤーの場合
            playerData = { userId: null, name: playerName, score: 0, items: [] };
        }
        
        currentPlayer = playerData;
        // sessionStorageにログイン情報を保存（タブを閉じるまで有効）
        sessionStorage.setItem('loggedInPlayer', JSON.stringify(currentPlayer));
        
        setupGame(currentPlayer);
    });

    // --- ページ読み込み時に、ログイン済みかチェック ---
    const loggedInPlayerJSON = sessionStorage.getItem('loggedInPlayer');
    if (loggedInPlayerJSON) {
        currentPlayer = JSON.parse(loggedInPlayerJSON);
        // スタート画面を飛ばして直接ゲームを開始
        setupGame(currentPlayer);
    }
});

// グローバルAPIの修正
window.gameApi = {
    updateScore: async (points) => {
        if (!currentPlayer) return;
        currentPlayer.score += points;
        document.getElementById('current-score').textContent = currentPlayer.score;
        await savePlayerData(currentPlayer);
    },
    addItem: async (itemName) => {
        if (!currentPlayer) return;
        if (!currentPlayer.items.includes(itemName)) {
            currentPlayer.items.push(itemName);
            await savePlayerData(currentPlayer);
        }
    },
    // GameSceneからプレイヤーデータを取得するための関数を追加
    getCurrentPlayer: () => currentPlayer
};