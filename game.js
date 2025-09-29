// =================================================================
// 1. 元のコードから移植した部分 (アイテム管理など)
// =================================================================

// プレイヤーが所持しているアイテム (グローバル変数として管理)
let PlayerItems = [];

// 観光スポットの情報
const spots = [
    { name: '太宰府天満宮', x: 350, y: 450, width: 50, height: 50, url: 'https://www.dazaifutenmangu.or.jp/', reward: '梅ヶ枝餅' },
    { name: '門司港レトロ', x: 650, y: 100, width: 50, height: 50, url: 'https://example.com/mojiko-minigame', reward: '焼きカレー' }
    // 必要に応じて他のスポットもここに追加
];

/**
 * アイテムボックスのHTML表示を更新する関数
 */
function displayItems() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = ''; // 表示を一旦リセット
    PlayerItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.textContent = item;
        itemsDiv.appendChild(itemElement);
    });
}

/**
 * 新しいアイテムを手に入れ、保存する関数
 * @param {string} itemName - 手に入れたアイテムの名前
 */
function addItem(itemName) {
    if (!PlayerItems.includes(itemName)) {
        PlayerItems.push(itemName);
        localStorage.setItem('playerItems', JSON.stringify(PlayerItems));
        displayItems();
        alert(`「${itemName}」を手に入れた！`);
    }
}

/**
 * ページ読み込み時に保存されたアイテムを読み込む関数
 */
function loadItems() {
    const savedItems = localStorage.getItem('playerItems');
    if (savedItems) {
        PlayerItems = JSON.parse(savedItems);
    }
    displayItems();
}

/**
 * (参考) URLパラメータから報酬を受け取る関数 (Phaserではあまり使わない)
 */
function checkForReward() {
    const urlParams = new URLSearchParams(window.location.search);
    const reward = urlParams.get('reward');
    if (reward) {
        addItem(reward);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}


// =================================================================
// 2. Phaserのシーン定義
// =================================================================

/**
 * メインのゲーム画面を管理するPhaserのシーン
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // ゲームで使う画像を事前に読み込む場所
    preload() {
        // 元のコードの `mapImage.src = ...` や `playerImage.src = ...` の部分
        this.load.image('map', 'assets/fukuoka_map_1.png');
        this.load.image('player', 'assets/player_icon_1_shadow.png'); // 元の'player_icon.png'から変更
    }

    // ゲームオブジェクトを作成し、配置する場所
    create() {
        // 背景画像を表示
        this.add.image(400, 300, 'map');

        // プレイヤーを物理演算が適用されるスプライトとして作成
        // 元のコードの `player` オブジェクトに相当
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true); // プレイヤーが画面外に出ないようにする

        // 観光スポットを見えない当たり判定エリアとして作成
        this.spotGroup = this.physics.add.staticGroup();
        spots.forEach(spot => {
            const spotZone = this.spotGroup.create(spot.x + spot.width / 2, spot.y + spot.height / 2, null)
                .setSize(spot.width, spot.height)
                .setVisible(false); // エリア自体は透明にする

            // 各エリアに名前や報酬などのデータを格納しておく
            spotZone.setData({ name: spot.name, url: spot.url, reward: spot.reward });
        });

        // プレイヤーとスポットエリアの当たり判定（重なり判定）を設定
        // 元のコードの `checkSpotCollision` 関数に相当
        this.physics.add.overlap(this.player, this.spotGroup, this.onSpotOverlap, null, this);

        // キーボード入力（矢印キー）を受け付ける準備
        // 元のコードの `keys` オブジェクトと `addEventListener` に相当
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // 毎フレーム（1秒間に約60回）実行される処理
    update() {
        // プレイヤーの移動処理
        // 元のコードの `updatePlayerPosition` 関数に相当
        const speed = 200; // プレイヤーの移動速度
        this.player.setVelocity(0); // キーが押されていない時は停止

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    // プレイヤーがスポットエリアに重なった時に自動で呼び出される関数
    onSpotOverlap(player, spotZone) {
        const spotName = spotZone.getData('name');

        // まだそのスポットを訪れていなければ
        if (!sessionStorage.getItem(`visited_${spotName}`)) {
            if (confirm(`「${spotName}」に到着！\n挑戦しますか？`)) {
                // 訪問済みの印をセッションストレージに保存
                sessionStorage.setItem(`visited_${spotName}`, 'true');

                // 報酬（アイテム）を獲得
                const reward = spotZone.getData('reward');
                addItem(reward); // グローバル関数を呼び出す
            }
        }
    }
}

/**
 * クイズ画面用のシーン (今回は未使用ですが、将来の拡張のために残します)
 */
class QuizScene extends Phaser.Scene {
    constructor() {
        super({ key: 'QuizScene' });
    }
    // ここにクイズ画面のpreload, create, updateを記述
}


// =================================================================
// 3. Phaserゲーム全体の設定と起動
// =================================================================

// Phaserのゲーム設定オブジェクト
const config = {
    type: Phaser.AUTO, // WebGLが使えるブラウザならWebGLを、そうでなければCanvasを自動で選択
    parent: 'game-container', // ゲーム画面を描画するHTML要素のID
    width: 800,
    height: 600,
    physics: {
        default: 'arcade', // シンプルで高速なアーケード物理演算を使用
        arcade: {
            gravity: { y: 0 }, // 重力はなし
            debug: false // trueにすると当たり判定エリアが可視化されデバッグに便利
        }
    },
    // このゲームで使用するシーンのリスト
    scene: [
        GameScene,
        QuizScene
    ]
};

// 上記の設定を使ってゲームを起動
const game = new Phaser.Game(config);

// ページの読み込みが完了したときにアイテムをロードする
window.addEventListener('load', () => {
    loadItems();
    checkForReward();
});