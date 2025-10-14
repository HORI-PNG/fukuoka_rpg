import { spots } from '../data/spots.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.virtualKeys = { up: false, down: false, left: false, right: false };
    }

    preload() {
        this.load.image('map', './assets/fukuoka_map_1.png');
        this.load.image('player_stand', './assets/player_icon_1_shadow.png');
        this.load.image('player_walk', './assets/player_icon_2_shadow.png');
    }

    create() {
        const map = this.add.image(400, 300, 'map');
        map.setDisplaySize(800, 600);

        // デバッグ用のグラフィックオブジェクトを作成（円を描画するように変更）
        const debugGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff, alpha: 0.5 } }); // 線で円を描くスタイル

        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            // 当たり判定の半径を spot の幅の半分に設定
            const radius = spot.width / 2;

            const spotObject = this.spotObjects.create(spot.x, spot.y, null)
                .setCircle(radius) // 当たり判定を円形に設定
                .setVisible(false);
            spotObject.name = spot.name;
            spotObject.reward = spot.reward;
            spotObject.url = spot.url;
            spotObject.type = spot.type;

            // 中心座標と半径を指定して円を描画
            debugGraphics.strokeCircle(spot.x, spot.y, radius);
        });

        this.anims.create({
            key: 'stand',
            frames: [ { key: 'player_stand' } ],
        });
        this.anims.create({
            key: 'walk',
            frames: [ { key: 'player_stand' }, { key: 'player_walk' } ],
            frameRate: 4,
            repeat: -1
        });

        this.player = this.physics.add.sprite(400, 300, 'player_stand');
        this.player.setDisplaySize(96, 96);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D');
        this.setupButtonEvents();

        this.physics.add.overlap(this.player, this.spotObjects, this.onSpotOverlap, null, this);
        this.updateItemBox();
    }

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

    // (setupButtonEvents 以降の関数は変更ありません)
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

            // spotにURLがあり、それが 'http' で始まらない（ローカルファイルである）場合
            if (spot.url && !spot.url.startsWith('http')) {
                // そのページに移動する
                window.location.href = spot.url;
            } else {
                // URLがないクイズなどの場合（従来の処理）
                this.scene.pause();
                if (spot.type === 'memory') {
                    this.scene.launch('MemoryScene', { spotName: spot.name, reward: spot.reward });
                } else {
                    this.scene.launch('QuizScene', { spotName: spot.name, reward: spot.reward });
                }
            }
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