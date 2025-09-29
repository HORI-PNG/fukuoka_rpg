import { spots } from '../data/spots.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.virtualKeys = { up: false, down: false, left: false, right: false };
    }

    preload() {
        this.load.image('map', './assets/fukuoka_map_1.png');
        
        // アニメーションに使う2枚の画像を個別に読み込みます
        this.load.image('player_stand', './assets/player_icon_1_shadow.png');
        this.load.image('player_walk', './assets/player_icon_2_shadow.png');
    }

    create() {
        // --- 背景の作成 ---
        const map = this.add.image(400, 300, 'map');
        map.setDisplaySize(800, 600);

        // --- 観光スポットの作成 ---
        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            const spotObject = this.spotObjects.create(spot.x + spot.width / 2, spot.y + spot.height / 2, null)
                .setSize(spot.width, spot.height).setVisible(false);
            spotObject.name = spot.name;
            spotObject.reward = spot.reward;
        });

        // ★★★【変更点】プレイヤーを作成する前に、アニメーションを定義する ★★★
        // これにより、アニメーションとサイズ変更の処理が衝突するのを防ぎます。
        this.anims.create({
            key: 'stand',
            frames: [ { key: 'player_stand' } ],
            frameRate: 1
        });
        this.anims.create({
            key: 'walk',
            // 2枚の画像を交互に表示するアニメーション
            frames: [
                { key: 'player_stand' },
                { key: 'player_walk' }
            ],
            frameRate: 4, // 1秒間に4回画像を切り替える
            repeat: -1    // 無限に繰り返す
        });


        // --- プレイヤーの作成 ---
        // 立ち姿の画像('player_stand')でプレイヤーを作成
        this.player = this.physics.add.sprite(400, 300, 'player_stand');
        this.player.setDisplaySize(96, 96); // サイズを指定
        this.player.setCollideWorldBounds(true);


        // --- 入力設定 ---
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D');
        this.setupButtonEvents(); // 画面のボタンを有効化

        // --- 当たり判定 ---
        this.physics.add.overlap(this.player, this.spotObjects, this.onSpotOverlap, null, this);
        
        // --- UIの更新 ---
        this.updateItemBox();
    }

    // (update関数や他の関数に変更はありません)
    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.keys.A.isDown || this.virtualKeys.left) {
            velocityX = -1;
            this.player.flipX = true;
        } else if (this.cursors.right.isDown || this.keys.D.isDown || this.virtualKeys.right) {
            velocityX = 1;
            this.player.flipX = false;
        }

        if (this.cursors.up.isDown || this.keys.W.isDown || this.virtualKeys.up) {
            velocityY = -1;
        } else if (this.cursors.down.isDown || this.keys.S.isDown || this.virtualKeys.down) {
            velocityY = 1;
        }

        const velocity = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
        this.player.setVelocity(velocity.x * speed, velocity.y * speed);

        if (velocityX !== 0 || velocityY !== 0) {
            this.player.anims.play('walk', true);
        } else {
            this.player.anims.play('stand', true);
        }
    }

    setupButtonEvents() {
        const buttonMapping = { 'btn-up': 'up', 'btn-down': 'down', 'btn-left': 'left', 'btn-right': 'right' };
        for (const [buttonId, direction] of Object.entries(buttonMapping)) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('pointerdown', () => { this.virtualKeys[direction] = true; });
                button.addEventListener('pointerup', () => { this.virtualKeys[direction] = false; });
                button.addEventListener('pointerout', () => { this.virtualKeys[direction] = false; });
            }
        }
    }
    
    onSpotOverlap(player, spot) {
        if (!sessionStorage.getItem(`visited_${spot.name}`)) {
            sessionStorage.setItem(`visited_${spot.name}`, 'true');
            this.scene.pause();
            this.scene.launch('QuizScene', { spotName: spot.name, reward: spot.reward });
        }
    }
    addItem(itemName) {
        if (!window.PlayerItems) { window.PlayerItems = JSON.parse(localStorage.getItem('playerItems')) || []; }
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
        const currentItems = JSON.parse(localStorage.getItem('playerItems')) || [];
        currentItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.textContent = item;
            itemsDiv.appendChild(itemElement);
        });
    }
}