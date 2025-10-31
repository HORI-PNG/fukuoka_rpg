import { GameScene } from './src/scenes/GameScene.js';
import { QuizScene } from './src/scenes/QuizScene.js';

// --- Phaser ゲーム設定 ---
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT, // 縦横比を保ったまま、親要素（game-container）にフィットさせる
        autoCenter: Phaser.Scale.CENTER_BOTH, // 親要素の中央に配置する
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [GameScene, QuizScene]
};

const SUPABASE_URL = 'https://ztuuvaubrldzhgmbcfcm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0dXV2YXVicmxkemhnbWJjZmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTM2MDUsImV4cCI6MjA3NzE4OTYwNX0.lJZp8kyVeryJ2CDPqRZnkFOQvGb_kFhBHKBb3rptTpA';

// Supabaseクライアントを初期化
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentPlayer = null;

// Supabaseからプレイヤーデータを取得（または新規作成）する関数
async function loginAndGetData(playerName) {
    try {
        const loginTime = new Date().toISOString();
        let { data, error } = await supabase
            .from('players')
            .select('*') // 'visited_spots'も含め全て取得
            .eq('name', playerName)
            .single();
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        if (data) {
            // 既存プレイヤーのログイン時間を更新
            const { data: updateData, error: updateError } = await supabase
                .from('players')
                .update({ latest_login_time: loginTime })
                .eq('name', playerName)
                .select()
                .single();
            if (updateError) {
                throw updateError;
            }
            return updateData;
        } else {
            // 新規プレイヤーの作成
            const { data: newData, error: insertError } = await supabase
                .from('players')
                .insert(
                    {
                        name: playerName,
                        score: 0,
                        items: [],
                        latest_login_time: loginTime,
                        visited_spots: [] // 訪問履歴を空で初期化
                    })
                .select()
                .single();
            
            if (insertError) {
                throw insertError;
            }
            return newData;
        }
    } catch (error) {
        console.error('データ取得エラー:', error);
        alert('サーバーからデータを取得できませんでした。');
        return null;
    }
}

// Supabaseにプレイヤーデータを丸ごと保存する関数
async function savePlayerData(player) {
    if (!player || !player.id) return;
    try {
        const { error } = await supabase
            .from('players')
            .update({
                name: player.name,
                score: player.score,
                items: player.items,
                // Supabaseのテーブル定義に合わせてキーを修正
                latest_login_time: player.latest_login_time,
                latest_logout_time: player.latest_logout_time,
                visited_spots: player.visited_spots // 訪問履歴も保存
            })
            .eq('id', player.id);
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('データ保存エラー:', error);
    }
}

// アイテムボックスの中身を更新する関数
function displayItems() {
    const itemsDiv = document.getElementById('items');
    const itemScoreSpan = document.getElementById('item-score');
    if (!itemsDiv || !itemScoreSpan) return;
    itemsDiv.innerHTML = ''; // 中身をリセット
    if (currentPlayer && Array.isArray(currentPlayer.items) && currentPlayer.items.length > 0) {
        itemScoreSpan.textContent = currentPlayer.items.length;
        currentPlayer.items.forEach(itemName => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item'; // (style.cssで定義済み)
            itemElement.textContent = itemName;
            itemsDiv.appendChild(itemElement);
        });
    } else {
        itemScoreSpan.textContent = 0;
        itemsDiv.textContent = 'まだアイテムを持っていません。';
    }
}

function setupGame(playerData) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // ゲーム開始時にアイテムボックスの中身を初期化
    displayItems();
    const game = new Phaser.Game(config);
}

window.addEventListener('load', () => {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');
    const resetButton = document.getElementById('reset-button');
    const deleteButton = document.getElementById('delete-data-button');

    // 💼ボタンとアイテムボックスの要素を取得
    const toggleItemsButton = document.getElementById('toggle-items-button');
    const itemsBox = document.getElementById('item-box');

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('プレイヤーを切り替えてログイン画面に戻りますか？')) {
                window.location.reload();
            }
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            if (!currentPlayer) {
                alert('現在ログインしているプレイヤーがいません。');
                return;
            }
            if (confirm(`本当にプレイヤー「${currentPlayer.name}」の全データをサーバーから削除しますか？\nこの操作は元に戻せません。`)) {
                try {
                    const { error } = await supabase
                        .from('players')
                        .delete()
                        .eq('id', currentPlayer.id);
                    if (error) {
                        throw error;
                    }
                    alert(`「${currentPlayer.name}」のデータを完全に削除しました。`);
                    window.location.reload(); // ページをリロードしてスタート画面に戻す
                } catch (error) {
                    alert('データ削除中にエラーが発生しました。');
                }
            }
        });
    }

    // 💼ボタンのクリックイベントを設定
    if (toggleItemsButton && itemsBox) {
        toggleItemsButton.addEventListener('click', () => {
            const isHidden = itemsBox.style.display === 'none' || itemsBox.style.display === '';
            if (isHidden) {
                displayItems(); // アイテムを表示する
                itemsBox.style.display = 'block';
            } else {
                itemsBox.style.display = 'none';
            }
        });
    }

    // スタート画面を表示
    startScreen.style.display = 'flex';
    startButton.addEventListener('click', async () => {
        const playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('プレイヤー名を入力してください。');
            return;
        }
        startButton.disabled = true;
        startButton.textContent = 'ロード中...';
        let playerData = await loginAndGetData(playerName);
        if (playerData) {
            currentPlayer = playerData;
            setupGame(currentPlayer);
        } else {
            alert('ログインに失敗しました。もう一度お試しください。');
            startButton.disabled = false;
            startButton.textContent = 'ゲーム開始';
        }
    });

    // ページを閉じる時の処理を Supabase 用に修正
    window.addEventListener('beforeunload', () => {
        if (currentPlayer) {
            currentPlayer.latest_logout_time = new Date().toISOString();
            // (GASの時とは違い、keepalive オプションは使えないため、
            //  同期的に送信する savePlayerData を呼び出す)
            savePlayerData(currentPlayer);
        }
    });
});

window.gameApi = {
    updateScore: async (points) => {
        if (!currentPlayer) return;
        currentPlayer.score += points;
        await savePlayerData(currentPlayer); // DBへの保存（ランキング用）は残す
    },
    addItem: async (itemName) => {
        if (!currentPlayer) return;
        if (!Array.isArray(currentPlayer.items)) { currentPlayer.items = []; }
        if (!currentPlayer.items.includes(itemName)) {
            currentPlayer.items.push(itemName);
        }
        await savePlayerData(currentPlayer);
        // ★ 追加： アイテム追加時にも、(非表示かもしれない) ボックスの中身を更新する
        displayItems();
    },
    // 訪問済スポットを保存するためのAPI
    addVisitedSpot: async (spotName) => {
        if (!currentPlayer) return;
        if (!Array.isArray(currentPlayer.visited_spots)) {
            currentPlayer.visited_spots = [];
        }
        if (!currentPlayer.visited_spots.includes(spotName)) {
            currentPlayer.visited_spots.push(spotName);
            // 訪問履歴(visited_spots)をSupabaseに保存
            await savePlayerData(currentPlayer);
        }
    },
    getCurrentPlayer: () => currentPlayer
};
