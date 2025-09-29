import { spots } from '../data/spots.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('map', './assets/fukuoka_map_1.png');
        // 新しいプレイヤー画像（剣を持っている方）に変更
        this.load.image('player', './assets/player_icon_3.png'); 
    }

    create() {
        // ▼▼▼ アイテムの初期ロードと表示 ▼▼▼
        this.loadItems();
        this.updateItemBox();

        // 背景画像
        this.add.image(400, 300, 'map');

        // 観光スポット
        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            const spotObject = this.spotObjects.create(spot.x + spot.width / 2, spot.y + spot.height / 2, null)
                .setSize(spot.width, spot.height)
                .setVisible(false);
            spotObject.name = spot.name;
            spotObject.reward = spot.reward;
        });

        // プレイヤー
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // キーボード入力
        this.cursors = this.input.keyboard.createCursorKeys();

        // 当たり判定
        this.physics.add.overlap(this.player, this.spotObjects, this.onSpotOverlap, null, this);
    }

    update() {
        this.player.setVelocity(0);
        const speed = 200;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true); // 左向きに反転
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false); // 右向き（通常）
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    // スポットに重なった時の処理
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

    // --- 以下、アイテム管理用の関数 ---
    loadItems() {
        const savedItems = localStorage.getItem('playerItems');
        if (savedItems) {
            window.PlayerItems = JSON.parse(savedItems);
        } else {
            window.PlayerItems = [];
        }
    }

    addItem(itemName) {
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