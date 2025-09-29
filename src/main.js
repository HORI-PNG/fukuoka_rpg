import { spots } from './data/spots.js';
import { keys, initializeInput } from './components/input.js';
import { player, updatePlayerPosition } from './components/player.js';

// === 設定 ===
const TILE_SIZE = 256;
const PLAYER_SPRITE_SIZE = 256;

const TILE_GRASS = 0;
const TILE_TREE = 1;
const TILE_ROCK = 2;
const TILE_SAND = 3;
const TILE_SEA = 8; // basic_tileset.png の水のタイルID

// ★通行不可タイルをここで定義
const COLLISION_TILES = [TILE_TREE, TILE_ROCK, TILE_SEA];

// マップ設計図
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
let dynamicMapData = JSON.parse(JSON.stringify(baseMapData));

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

// === 初期化 ===
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimap-canvas');
const minimapCtx = minimapCanvas.getContext('2d');
const stepCounterElement = document.getElementById('step-counter');

const MAP_COLS = baseMapData[0].length;
const MAP_ROWS = baseMapData.length;
const VIEWPORT_COLS = 10;
const VIEWPORT_ROWS = 10;
canvas.width = VIEWPORT_COLS * TILE_SIZE;
canvas.height = VIEWPORT_ROWS * TILE_SIZE;

const MINIMAP_TILE_SIZE = 10;
minimapCanvas.width = MAP_COLS * MINIMAP_TILE_SIZE;
minimapCanvas.height = MAP_ROWS * MINIMAP_TILE_SIZE;

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
function loadGameData() {
    const savedItems = localStorage.getItem('playerItems');
    if (savedItems) PlayerItems = JSON.parse(savedItems);
    displayItems();
    
    const savedSteps = localStorage.getItem('playerSteps');
    if (savedSteps) player.steps = parseInt(savedSteps, 10);
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

let mapChanged = false;
function checkMapUpdate() {
    if (player.steps >= 30 && !mapChanged) {
        updateMapToSea();
        mapChanged = true;

        if (dynamicMapData[player.y][player.x] === TILE_SEA) {
            alert('うわっ！潮が満ちてきた！流されてしまった...');
            player.x = 1;
            player.y = 1;
        }
    }
}

function updateMapToSea() {
    const changeCoordinates = [
        { y: 1, x: 5 }, { y: 1, x: 6 },
        { y: 4, x: 7 }, { y: 4, x: 8 },
        { y: 7, x: 3 }, { y: 8, x: 3 }, { y: 8, x: 4 },
    ];

    changeCoordinates.forEach(coord => {
        if (dynamicMapData[coord.y][coord.x] === TILE_GRASS) {
            dynamicMapData[coord.y][coord.x] = TILE_SEA;
        }
    });
}

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

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tileId = dynamicMapData[row][col];
            const sourceX = (tileId % 4) * 256;
            const sourceY = Math.floor(tileId / 4) * 256;
            ctx.drawImage(
                tilesetImage, sourceX, sourceY, 256, 256, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tileId = objectMapData[row][col];
            if (tileId === -1) continue;
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

function drawMinimap() {
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tileId = dynamicMapData[row][col];
            switch(tileId) {
                case TILE_GRASS: minimapCtx.fillStyle = 'green'; break;
                case TILE_TREE: minimapCtx.fillStyle = 'darkgreen'; break;
                case TILE_ROCK: minimapCtx.fillStyle = 'gray'; break;
                case TILE_SAND: minimapCtx.fillStyle = 'yellow'; break;
                case TILE_SEA: minimapCtx.fillStyle = 'blue'; break;
                default: minimapCtx.fillStyle = 'black';
            }
            minimapCtx.fillRect(col * MINIMAP_TILE_SIZE, row * MINIMAP_TILE_SIZE, MINIMAP_TILE_SIZE, MINIMAP_TILE_SIZE);
        }
    }
    drawMinimapPlayer();
}

function drawMinimapPlayer() {
    minimapCtx.fillStyle = 'red';
    minimapCtx.fillRect(player.x * MINIMAP_TILE_SIZE, player.y * MINIMAP_TILE_SIZE, MINIMAP_TILE_SIZE, MINIMAP_TILE_SIZE);
}


// === ゲームループ ===
function gameLoop() {
    // ★COLLISION_TILES を引数として渡す
    updatePlayerPosition(keys, dynamicMapData, COLLISION_TILES);
    draw();
    drawMinimap();
    stepCounterElement.textContent = player.steps;
    
    checkMapUpdate();
    checkSpotCollision();
    checkSpecialStageCondition();
    requestAnimationFrame(gameLoop);
}

// === 初期化処理 ===
function init() {
    initializeInput(); 
    loadGameData(); 
    checkForReward();
    document.getElementById('special-stage-button')?.addEventListener('click', () => { window.location.href = './games/special_stage/index.html'; });
    document.getElementById('reset-button')?.addEventListener('click', () => { if (confirm('リセットしますか？')) { localStorage.clear(); window.location.reload(); } });
    document.getElementById('toggle-items-button')?.addEventListener('click', toggleItemBox);
    document.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'e') toggleItemBox(); });
    
    const bgmToggleButton = document.getElementById('bgm-toggle-button');
    const bgm = document.getElementById('bgm');
    if (bgm) bgm.volume = 0.2;
    if (bgmToggleButton && bgm) {
        bgmToggleButton.textContent = bgm.muted ? '🔇' : '🔊';
        bgmToggleButton.addEventListener('click', () => {
            bgm.muted = !bgm.muted;
            bgmToggleButton.textContent = bgm.muted ? '🔇' : '🔊';
        });
    }

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
}