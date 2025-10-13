import { spots } from './data/spots.js';
import { keys, initializeInput } from './components/input.js';
import { player, updatePlayerPosition } from './components/player.js';

// === 設定 ===
const TILE_SIZE = 1024 / 4;
const PLAYER_SPRITE_SIZE = 1024 / 4; // キャラクターの1コマのサイズ

// マップ設計図
// 1. 地面レイヤー
const baseMapData = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 3, 3, 3, 3, 0, 2, 0, 1],
  [1, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// 0: 博多ラーメン, 4: 太宰府, 5: 福岡タワー, 12: 門司港レトロ など
const objectMapData = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1,  0, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1], 
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1,  5, -1, -1, -1, -1, -1, -1, -1], 
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 12, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];
const TILE_GRASS = 0;
const TILE_TREE = 1;
const TILE_ROCK = 2;
const TILE_SAND = 3;

// === 初期化 ===
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const MAP_COLS = baseMapData[0].length;
const MAP_ROWS = baseMapData.length;
const VIEWPORT_COLS = 5;
const VIEWPORT_ROWS = 4;
canvas.width = VIEWPORT_COLS * TILE_SIZE;
canvas.height = VIEWPORT_ROWS * TILE_SIZE;
let PlayerItems = [];

// === 画像読み込み ===
const tilesetImage = new Image();
const specialTilesetImage = new Image();
const playerSpriteImage = new Image();
tilesetImage.src = './assets/basic_tileset.png';
specialTilesetImage.src = './assets/special_tileset.png';
playerSpriteImage.src = './assets/splite.png';
let imagesLoaded = 0;
const totalImages = 3;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        init();
    }
}
tilesetImage.onload = onImageLoad;
specialTilesetImage.onload = onImageLoad;
playerSpriteImage.onload = onImageLoad;

// === UI関数 ===
function toggleItemBox() {
    const itemBox = document.getElementById('item-box');
    itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
}
function displayItems() {
    const itemsDiv = document.getElementById('items');
    if (!itemsDiv) return;
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
    if (savedItems) PlayerItems = JSON.parse(savedItems);
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

// === ゲームロジック ===
function checkSpotCollision() {
    if (player.isMoving) return;
    const spot = spots.find(s => s.x === player.x && s.y === player.y);
    if (spot && !sessionStorage.getItem(`visited_${spot.name}`)) {
        sessionStorage.setItem(`visited_${spot.name}`, 'true');
        window.location.href = spot.url;
    }
}
function checkSpecialStageCondition() {
    const requiredItems = 3;
    const specialStageArea = document.getElementById('special-stage-area');
    if (specialStageArea && PlayerItems.length >= requiredItems) {
        specialStageArea.style.display = 'block';
    }
}

<<<<<<< HEAD
// === 描画処理 ===
function draw() {
    let cameraX = canvas.width / 2 - player.x * TILE_SIZE;
    let cameraY = canvas.height / 2 - player.y * TILE_SIZE;
    const minCameraX = canvas.width - (MAP_COLS * TILE_SIZE);
    cameraX = Math.max(cameraX, minCameraX);
    cameraX = Math.min(cameraX, 0);
    const minCameraY = canvas.height - (MAP_ROWS * TILE_SIZE);
    cameraY = Math.max(cameraY, minCameraY);
    cameraY = Math.min(cameraY, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cameraX, cameraY);
    // 1. 地面レイヤーを描画
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tileId = baseMapData[row][col];
            const sourceX = (tileId % 4) * 256; // TILE_SIZE=256
            const sourceY = Math.floor(tileId / 4) * 256;
            ctx.drawImage(
                tilesetImage, sourceX, sourceY, 256, 256, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
=======
// ★追加：特殊ステージの条件をチェックする新しい関数
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
>>>>>>> 0fcdcbeb0b374e067ea332318373cb4f7e3f4880
    }
    
    // 2. 物体レイヤーを描画
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tileId = objectMapData[row][col];
            if (tileId === -1) continue; // -1なら何もしない
            const sourceX = (tileId % 4) * 256;
            const sourceY = Math.floor(tileId / 4) * 256;
            ctx.drawImage(specialTilesetImage, sourceX, sourceY, 256, 256, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
        }
    }
    drawPlayer();
    ctx.restore();
}
function drawPlayer() {
    const sourceX = player.animFrame * PLAYER_SPRITE_SIZE;
    const sourceY = player.direction * PLAYER_SPRITE_SIZE;
    const destX = player.x * TILE_SIZE + (TILE_SIZE - PLAYER_SPRITE_SIZE) / 2;
    const destY = player.y * TILE_SIZE + (TILE_SIZE - PLAYER_SPRITE_SIZE) / 2;
    ctx.save();
    if (keys.ArrowRight && !player.isMoving) {
        ctx.scale(-1, 1);
        ctx.drawImage(playerSpriteImage, sourceX, sourceY, PLAYER_SPRITE_SIZE, PLAYER_SPRITE_SIZE, -destX - PLAYER_SPRITE_SIZE, destY, PLAYER_SPRITE_SIZE, PLAYER_SPRITE_SIZE);
    } else {
        ctx.drawImage(playerSpriteImage, sourceX, sourceY, PLAYER_SPRITE_SIZE, PLAYER_SPRITE_SIZE, destX, destY, PLAYER_SPRITE_SIZE, PLAYER_SPRITE_SIZE);
    }
    ctx.restore();
}

// === ゲームループ ===
function gameLoop() {
    updatePlayerPosition(keys, baseMapData);
    draw();
    checkSpotCollision();
<<<<<<< HEAD
    checkSpecialStageCondition();
=======
    checkSpecialStageCondition(); // 特殊ステージの条件をチェック
>>>>>>> 0fcdcbeb0b374e067ea332318373cb4f7e3f4880
    requestAnimationFrame(gameLoop);
}

// === 初期化処理 ===
function init() {
<<<<<<< HEAD
    initializeInput(); loadItems(); checkForReward();
    // イベントリスナー
    document.getElementById('special-stage-button')?.addEventListener('click', () => { window.location.href = './games/special_stage/index.html'; });
    document.getElementById('reset-button')?.addEventListener('click', () => { if (confirm('リセットしますか？')) { localStorage.clear(); window.location.reload(); } });
    document.getElementById('toggle-items-button')?.addEventListener('click', toggleItemBox);
    document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'e') toggleItemBox(); });
    
    const bgmToggleButton = document.getElementById('bgm-toggle-button');
=======
    // 最初に共通の処理を実行
    initializeInput();
    loadItems();
    checkForReward();

    // HTML要素を取得
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
>>>>>>> 0fcdcbeb0b374e067ea332318373cb4f7e3f4880
    const bgm = document.getElementById('bgm');
    if (bgm) bgm.volume = 0.2;
    if (bgmToggleButton && bgm) {
        bgmToggleButton.textContent = bgm.muted ? '🔇' : '🔊';
        bgmToggleButton.addEventListener('click', () => {
            bgm.muted = !bgm.muted;
            bgmToggleButton.textContent = bgm.muted ? '🔇' : '🔊';
        });
    }

<<<<<<< HEAD
    // 画面表示の分岐
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    if (localStorage.getItem('hasPlayedBefore') === 'true') {
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        gameLoop();
    } else {
        startScreen.style.display = 'flex';
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => {
            localStorage.setItem('hasPlayedBefore', 'true');
            startScreen.style.display = 'none';
            gameContainer.style.display = 'block';
            if(bgm) bgm.play();
            gameLoop();
        }, { once: true });
    }
=======
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
            const itemBox = document.getElementById('item-box');
            if (itemBox.style.display === 'block') {
                itemBox.style.display = 'none';
            } else {
                itemBox.style.display = 'block';
            }
        }
    });
>>>>>>> 0fcdcbeb0b374e067ea332318373cb4f7e3f4880
}