// 各モジュールから必要な変数や関数をインポート
import { spots } from './data/spots.js';
import { keys, initializeInput } from './components/input.js';
import { player, updatePlayerPosition } from './components/player.js';

// --- 初期設定 ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let PlayerItems = [];
let gameState = 'playing'; // ゲームの状態を管理 (playing, dialog)
let ignoredSpot = null;    // 一時的に無視するスポット

// --- 画像の読み込み ---
const mapImage = new Image();
const playerImage1 = new Image();
const playerImage2 = new Image();

// 上記で想定したフォルダ構成に合わせてパスを指定しています
mapImage.src = './assets/fukuoka_map.png';
playerImage1.src = './assets/player_icon_1.png';
playerImage2.src = './assets/player_icon_2.png';

let imagesLoaded = 0;
const totalImages = 3; // 読み込む画像は3枚
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        init(); // 
    }
}
mapImage.onload = onImageLoad;
playerImage1.onload = onImageLoad;
playerImage2.onload = onImageLoad;

// --- UI関連の関数 ---
function displayItems() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';
    PlayerItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.textContent = item;
        itemsDiv.appendChild(itemElement);
    });
}

function loadItems() {
    const savedItems = localStorage.getItem('playerItems');
    if (savedItems) {
        PlayerItems = JSON.parse(savedItems);
    }
    displayItems();
}

function addItem(itemName) {
    if (!PlayerItems.includes(itemName)) {
        PlayerItems.push(itemName);
        localStorage.setItem('playerItems', JSON.stringify(PlayerItems));
        displayItems();
        alert(`「${itemName}」を手に入れた！`);
    }
}

function checkForReward() {
    const urlParams = new URLSearchParams(window.location.search);
    const reward = urlParams.get('reward');
    if (reward) {
        addItem(reward);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// --- ゲームロジック関連の関数 ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

    spots.forEach(spot => {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fillRect(spot.x, spot.y, spot.width, spot.height);
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(spot.name, spot.x, spot.y - 5);
    });

    let currentImage;
    // 移動中はアニメーションフレームに応じて画像を切り替え
    if (player.isMoving) {
        currentImage = player.animFrame === 0 ? playerImage1 : playerImage2;
    } else {
        // 停止中は1枚目の画像を立ち絵として表示
        currentImage = playerImage1;
    }

    ctx.save(); // 現在の描画状態を保存
    // 左向きの時だけ画像を反転させる
    if (player.direction === 'left') {
        ctx.scale(-1, 1); // 左右反転
        // 反転させた分、描画位置をずらす
        ctx.drawImage(currentImage, -player.x - player.width, player.y, player.width, player.height);
    } else {
        ctx.drawImage(currentImage, player.x, player.y, player.width, player.height);
    }
    ctx.restore(); // 描画状態を元に戻す
}

// checkSpotCollision 関数をまるごとこれに置き換える

function checkSpotCollision() {
    spots.forEach(spot => {
        if (
            player.x < spot.x + spot.width &&
            player.x + player.width > spot.x &&
            player.y < spot.y + spot.height &&
            player.y + player.height > spot.y
        ) {
            if (!sessionStorage.getItem(`visited_${spot.name}`)) {
                // プレイヤーの動きを止める
                gameState = 'dialog'; 
                
                // 一度訪問したことを記録
                sessionStorage.setItem(`visited_${spot.name}`, 'true');
                
                // 強制的にURLに移動
                window.location.href = spot.url;
            }
        }
    });
}

// 特殊ステージの条件をチェックする新しい関数
function checkSpecialStageCondition() {
    const requiredItems = 3; // ボタン表示に必要なアイテム数
    const specialStageArea = document.getElementById('special-stage-area');

    // プレイヤーの所持アイテム数が条件を満たしたらボタンを表示
    if (PlayerItems.length >= requiredItems) {
        specialStageArea.style.display = 'block';
    }
}

// --- ゲームのメインループ ---
function gameLoop() {
    if (gameState === 'playing') {
        updatePlayerPosition(keys, canvas);
    }
    draw();
    checkSpotCollision();
    checkSpecialStageCondition(); // 特殊ステージの条件をチェック
    requestAnimationFrame(gameLoop);
}

function toggleItemBox() {
    const itemBox = document.getElementById('item-box');
    if (itemBox.style.display === 'block') {
        itemBox.style.display = 'none';
    } else {
        itemBox.style.display = 'block';
    }
}

// --- 初期化処理 ---
function init() {
    // 最初に共通の処理を実行
    initializeInput();
    loadItems();
    checkForReward();

    // HTML要素を取得
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const bgm = document.getElementById('bgm');

    // localStorageに'hasPlayedBefore'という記録があるかチェック
    if (localStorage.getItem('hasPlayedBefore') === 'true') {
        // 【2回目以降のアクセスの場合】
        // スタート画面を隠し、ゲーム画面を直接表示
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';

        // BGMは自動再生されない可能性があります
        // 多くのブラウザでは、ユーザーが最初にクリックしないと音声を再生できません。
        // そのため、2回目以降はBGMなしで静かにゲームが始まります。

        // ゲームループを即座に開始
        gameLoop();

    } else {
        // 【初回アクセスの場合】
        // スタートボタンのクリックを待つ
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => {
            // クリックされたら、「プレイ済み」の記録をlocalStorageに保存
            localStorage.setItem('hasPlayedBefore', 'true');

            // スタート画面を隠し、ゲーム画面を表示
            startScreen.style.display = 'none';
            gameContainer.style.display = 'block';

            // BGMを再生
            bgm.play();

            // ゲームループを開始
            gameLoop();
        });
    }

    // ★追加：特殊ステージボタンのクリックイベント
    const specialStageButton = document.getElementById('special-stage-button');
    specialStageButton.addEventListener('click', () => {
        window.location.href = './games/special_stage/index.html';
    });

    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
        // 確認ダイアログを表示
        if (confirm('本当にすべてのデータをリセットして、はじめからやり直しますか？')) {
            // 保存されているデータを削除
            localStorage.removeItem('playerItems');
            localStorage.removeItem('hasPlayedBefore');
            
            // ページを再読み込みしてゲームをリスタート
            window.location.reload();
        }
    });

    // Eキーのイベントリスナー
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'e') {
            toggleItemBox();
        }

        const toggleItemsButton = document.getElementById('toggle-items-button');
        toggleItemsButton.addEventListener('click', () => {
        toggleItemBox(); // ★同じ共通関数を呼び出す
        });
    });
}