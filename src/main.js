// 各モジュールから必要な変数や関数をインポート
import { spots } from './data/spots.js';
import { keys, initializeInput } from './components/input.js';
import { player, updatePlayerPosition } from './components/player.js';

// --- 初期設定 ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let PlayerItems = [];

// --- 画像の読み込み ---
const mapImage = new Image();
const playerImage = new Image();
mapImage.src = './assets/fukuoka_map.png';     // 画像パスを修正
playerImage.src = './assets/player_icon.png'; // 画像パスを修正

let imagesLoaded = 0;
const totalImages = 2;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop(); // 全ての画像が読み込まれたらゲームを開始
    }
}
mapImage.onload = onImageLoad;
playerImage.onload = onImageLoad;

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

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function checkSpotCollision() {
    spots.forEach(spot => {
        if (player.x < spot.x + spot.width &&
            player.x + player.width > spot.x &&
            player.y < spot.y + spot.height &&
            player.y + player.height > spot.y
        ) {
            if (!sessionStorage.getItem(`visited_${spot.name}`)) {
                if (confirm(`「${spot.name}」に到着！\nミニゲームに挑戦しますか？`)) {
                    sessionStorage.setItem(`visited_${spot.name}`, 'true');
                    window.location.href = spot.url;
                }
            }
        }
    });
}

// --- ゲームのメインループ ---
function gameLoop() {
    updatePlayerPosition(keys, canvas); // 引数を渡す
    draw();
    checkSpotCollision();
    requestAnimationFrame(gameLoop);
}

// --- 初期化処理 ---
function init() {
    initializeInput(); // キー入力の受付を開始
    loadItems();
    checkForReward();
}

init(); // ゲームの初期化を実行