import { spots } from '../data/spots.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('map', './assets/fukuoka_map_1.png');
        this.load.image('player', './assets/player_icon_3_shadow.png'); // 影付きのジャンプ画像に変更
    }

    create() {
        this.loadItems();
        this.updateItemBox();
        this.add.image(400, 300, 'map');

        // 観光スポットの当たり判定エリアを作成
        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            const spotObject = this.spotObjects.create(spot.x + spot.width / 2, spot.y + spot.height / 2, null)
                .setSize(spot.width, spot.height)
                .setVisible(false);
            
            // ★重要：当たり判定オブジェクトに、スポット名と報酬のデータを格納します
            spotObject.setData('name', spot.name);
            spotObject.setData('reward', spot.reward);
        });

        // プレイヤーを作成
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // キーボード入力を設定
        this.cursors = this.input.keyboard.createCursorKeys();

        // プレイヤーとスポットが重なったら onSpotOverlap 関数を呼び出すように設定
        this.physics.add.overlap(this.player, this.spotObjects, this.onSpotOverlap, null, this);
    }

    update() {
        this.player.setVelocity(0);
        const speed = 200;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    /**
     * スポットに重なった（入った）ときに呼び出される関数
     * @param {Phaser.GameObjects.Sprite} player - プレイヤーオブジェクト
     * @param {Phaser.GameObjects.Sprite} spot - 重なったスポットの当たり判定オブジェクト
     */
    onSpotOverlap(player, spot) {
        // スポットオブジェクトからスポット名と報酬を取得
        const spotName = spot.getData('name');
        const reward = spot.getData('reward');

        // まだ訪れていなければクイズを開始
        if (!sessionStorage.getItem(`visited_${spotName}`)) {
            sessionStorage.setItem(`visited_${spotName}`, 'true');
            
            // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
            // ここでクイズシーンを起動しています！
            // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
            this.scene.pause(); // メインゲームを一時停止
            this.scene.launch('QuizScene', {
                spotName: spotName,
                reward: reward
            });
        }
    }

    // --- 以下、アイテム管理用の関数 (変更なし) ---
    loadItems() {
        const savedItems = localStorage.getItem('playerItems');
        if (savedItems) {
            window.PlayerItems = JSON.parse(savedItems);
        } else {
            window.PlayerItems = [];
        }
    }

    addItem(itemName) {
        if (!window.PlayerItems) {
            window.PlayerItems = [];
        }
        if (!window.PlayerItems.includes(itemName)) {
            window.PlayerItems.push(itemName);
            localStorage.setItem('playerItems', JSON.stringify(window.PlayerItems));
            this.updateItemBox();
            alert(`「${itemName}」を手に入れた！`);
        }
    }
    
    updateItemBox() {
        const itemsDiv = document.getElementById('items');
        itemsDiv.innerHTML = '';
        if (window.PlayerItems) {
            window.PlayerItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item';
                itemElement.textContent = item;
                itemsDiv.appendChild(itemElement);
            });
        }
    }
}