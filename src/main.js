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
const JUMP_POWER = 15; // ジャンプの強さ
const GRAVITY = 0.8;   // 重力
let redirectUrl = null; // 遷移先のURLを一時的に保存

// --- 画像の読み込み ---
const mapImage = new Image();
const playerImage1 = new Image();
const playerImage2 = new Image();
const playerImageJump = new Image(); // ジャンプ用の画像変数を追加

// 上記で想定したフォルダ構成に合わせてパスを指定しています
mapImage.src = './assets/fukuoka_map_1.png';
playerImage1.src = './assets/player_icon_1_shadow.png';
playerImage2.src = './assets/player_icon_2_shadow.png';
playerImageJump.src = './assets/player_icon_3_shadow.png';

let imagesLoaded = 0;
const totalImages = 4; // 読み込む画像は4枚
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        init(); // 
    }
}
mapImage.onload = onImageLoad;
playerImage1.onload = onImageLoad;
playerImage2.onload = onImageLoad;
playerImageJump.onload = onImageLoad;

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
        ctx.fillStyle = 'rgba(91, 135, 176, 0.5)';
        ctx.fillRect(spot.x, spot.y, spot.width, spot.height);
        ctx.fillStyle = 'black';
        ctx.font = '12px sans-serif';
        ctx.fillText(spot.name, spot.x, spot.y - 5);
    });

    let currentImage;
    // 状態に応じて表示する画像を切り替え
    if (player.isJumping) {
        // ジャンプ中はジャンプ専用画像
        currentImage = playerImageJump;
    } else if (player.isMoving) {
        // 移動中はアニメーション
        currentImage = player.animFrame === 0 ? playerImage1 : playerImage2;
    } else {
        // 停止中は立ち絵
        currentImage = playerImage1;
    }

    ctx.save(); 
    if (player.direction === 'left') {
        ctx.scale(-1, 1); 
        ctx.drawImage(currentImage, -player.x - player.width, player.y, player.width, player.height);
    } else {
        ctx.drawImage(currentImage, player.x, player.y, player.width, player.height);
    }
    ctx.restore(); 
}


// checkSpotCollision 関数をまるごとこれに置き換える
// checkSpotCollision 関数をまるごとこれに置き換える
function checkSpotCollision() {
    // gameStateが'playing'の時だけあたり判定を行う
    if (gameState !== 'playing') return;

    for (const spot of spots) {
        if (
            player.x < spot.x + spot.width &&
            player.x + player.width > spot.x &&
            player.y < spot.y + spot.height &&
            player.y + player.height > spot.y
        ) {
            // ↓↓↓ 正しいテンプレートリテラルに修正 ↓↓↓
            if (!sessionStorage.getItem(`visited_${spot.name}`)) {
                // gameStateを'jumping'に変更して、プレイヤーの操作を一時的に無効化
                gameState = 'jumping'; 
                
                // ジャンプの初期設定
                player.isJumping = true;
                player.initialY = player.y; // ジャンプ開始位置を記録
                player.jumpVelocity = -JUMP_POWER; // 上向きの初速を与える

                // 訪問記録と遷移先URLの保存
                sessionStorage.setItem(`visited_${spot.name}`, 'true');
                redirectUrl = spot.url; // URLを保存

                // 他のスポットとの重複判定を防ぐためループを抜ける
                break;
            }
        }
    }
}

// --- ゲームのメインループ ---
function gameLoop() {
    if (gameState === 'playing') {
        updatePlayerPosition(keys, canvas);
        checkSpotCollision(); 
    } else if (gameState === 'jumping') {
        player.y += player.jumpVelocity;
        player.jumpVelocity += GRAVITY;

        // ジャンプ中はアニメーションフレームの更新をしない

        if (player.y > player.initialY) {
            player.y = player.initialY;
            player.isJumping = false;
            
            if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        }
    }

    draw();
    requestAnimationFrame(gameLoop);
}

// --- 初期化処理 ---
function init() {
    initializeInput();
    loadItems();
    checkForReward();

    // BGMとスタート画面の処理を追加
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const bgm = document.getElementById('bgm');

    startButton.addEventListener('click', () => {
        // スタート画面を非表示にする
        startScreen.style.display = 'none';
        // ゲームコンテナを表示する
        gameContainer.style.display = 'block';

        // BGMを再生
        bgm.play();

        // ゲームループを開始
        gameLoop(); 
    });

    // Eキーでアイテムボックスの表示/非表示を切り替える
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
}
