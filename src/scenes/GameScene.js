import { spots } from '../data/spots.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    // ゲームで使う画像を読み込む
    preload() {
        // HTMLからの相対パスで画像を指定
        this.load.image('map', './assets/fukuoka_map_1.png');
        this.load.image('player', './assets/player_icon_1_shadow.png');
    }

    // ゲームのオブジェクトを作成・配置する
    create() {
        // 背景画像
        this.add.image(400, 300, 'map').setOrigin(0.5, 0.5);

        // 観光スポットを物理オブジェクトとして作成
        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            const spotObject = this.spotObjects.create(spot.x + spot.width / 2, spot.y + spot.height / 2, null)
                .setSize(spot.width, spot.height)
                .setVisible(false);
            spotObject.name = spot.name;
            spotObject.reward = spot.reward;
        });

        // プレイヤーを物理オブジェクトとして作成
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // キーボード入力を設定
        this.cursors = this.input.keyboard.createCursorKeys();

        // 当たり判定を設定
        this.physics.add.overlap(this.player, this.spotObjects, this.onSpotOverlap, null, this);
        
        // アイテムボックスを初期状態で更新
        this.updateItemBox();
    }

    // 毎フレーム呼ばれる処理
    update() {
        // プレイヤーの移動処理
        this.player.setVelocity(0);
        const speed = 200;

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

    // スポットに重なったときの処理
    onSpotOverlap(player, spot) {
        if (!sessionStorage.getItem(`visited_${spot.name}`)) {
            sessionStorage.setItem(`visited_${spot.name}`, 'true');
            
            this.scene.pause();
            this.scene.launch('QuizScene', {
                spotName: spot.name,
                reward: spot.reward
            });
        }
    }

    // アイテムを追加する（QuizSceneから呼ばれる）
    addItem(itemName) {
        if (!window.PlayerItems) {
            window.PlayerItems = JSON.parse(localStorage.getItem('playerItems')) || [];
        }
        if (!window.PlayerItems.includes(itemName)) {
            window.PlayerItems.push(itemName);
            localStorage.setItem('playerItems', JSON.stringify(window.PlayerItems));
            this.updateItemBox();
            alert(`「${itemName}」を手に入れた！`);
        }
    }
    
    // アイテムボックスの表示を更新
    updateItemBox() {
        const itemsDiv = document.getElementById('items');
        itemsDiv.innerHTML = '';
        const currentItems = JSON.parse(localStorage.getItem('playerItems')) || [];
        currentItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.textContent = item;
            itemsDiv.appendChild(itemElement);
        });
    }
}