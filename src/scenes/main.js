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

mapImage.src = './assets/fukuoka_map_1.png';
playerImage1.src = './assets/player_icon_1_shadow.png';
playerImage2.src = './assets/player_icon_2_shadow.png';
playerImageJump.src = './assets/player_icon_3_shadow.png';

let imagesLoaded = 0;
const totalImages = 4; // 読み込む画像は4枚
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        init();
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
        // URLからパラメータを消去してリロード時に再度アイテムが追加されるのを防ぐ
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// --- スコア管理用の関数 ---
/**
 * 全プレイヤーのスコアデータを取得する
 * @returns {Object} プレイヤー名をキー、スコアを値とするオブジェクト
 */
function getScores() {
    const scores = localStorage.getItem('gameScores');
    return scores ? JSON.parse(scores) : {};
}

/**
 * スコアを保存する
 * @param {string} playerName - スコアを保存するプレイヤー名
 * @param {number} points - 加算するポイント
 */
function saveScore(playerName, points) {
    const scores = getScores();
    if (scores[playerName]) {
        scores[playerName] += points;
    } else {
        scores[playerName] = points;
    }
    localStorage.setItem('gameScores', JSON.stringify(scores));
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
    if (player.isJumping) {
        currentImage = playerImageJump;
    } else if (player.isMoving) {
        currentImage = player.animFrame === 0 ? playerImage1 : playerImage2;
    } else {
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

function checkSpotCollision() {
    if (gameState !== 'playing') return;

    for (const spot of spots) {
        if (
            player.x < spot.x + spot.width &&
            player.x + player.width > spot.x &&
            player.y < spot.y + spot.height &&
            player.y + player.height > spot.y
        ) {
            if (!sessionStorage.getItem(`visited_${spot.name}`)) {
                gameState = 'jumping';
                player.isJumping = true;
                player.initialY = player.y;
                player.jumpVelocity = -JUMP_POWER;
                sessionStorage.setItem(`visited_${spot.name}`, 'true');
                redirectUrl = spot.url;
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
// --- 初期化処理 ---
function init() {
    // キーボードやボタン操作の受付を開始する
    initializeInput();
    // 保存されているアイテムを読み込んで表示する
    loadItems();
    // クイズ正解後の報酬をURLから受け取る
    checkForReward();

    // HTMLからスタート画面やボタンなどの要素を取得
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameContainer = document.getElementById('game-container');
    const bgm = document.getElementById('bgm');

    // 「ゲームを開始する」ボタンがクリックされたときの処理
    startButton.addEventListener('click', () => {
        const playerNameInput = document.getElementById('player-name');
        const playerName = playerNameInput.value;

        // 名前が入力されていなかったらアラートを出す
        if (!playerName) {
            alert('プレイヤー名を入力してください。');
            return;
        }

        // 現在操作しているプレイヤーの名前を一時的に保存
        sessionStorage.setItem('currentPlayer', playerName);

        // スタート画面を消して、ゲーム画面を表示する
        startScreen.style.display = 'none';
        gameContainer.style.display = 'block';

        // 画面左上にプレイヤー名と現在のスコアを表示する
        const gameInfo = document.getElementById('game-info');
        if (gameInfo) {
            document.getElementById('current-player').textContent = playerName;
            const scores = getScores();
            document.getElementById('current-score').textContent = scores[playerName] || 0;
            gameInfo.style.display = 'block';
        }

        // BGMを再生する
        bgm.play();

        // ゲームのメインループを開始する
        gameLoop();
    });

    // 'e'キーが押されたらアイテムボックスの表示/非表示を切り替える
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

    // リセットボタンが押されたときの処理
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // 確認ダイアログを表示
            if (confirm('訪問履歴をリセットして、もう一度スポットを訪れられるようにしますか？')) {
                // 訪問履歴をすべて消去
                sessionStorage.clear();
                // ページをリロードしてゲームを最初から開始
                window.location.reload();
            }
        });
    }
}