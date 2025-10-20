const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_AExrSSQwr2T3h1JjNseMzO3j1MTiJLnqDCYJkvxT5dukoY007kje9x1D_fx25kJWQQ/exec';

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

        const debugGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff, alpha: 0.5 } });

        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            const radius = spot.width / 2;
            const spotObject = this.spotObjects.create(spot.x, spot.y, null)
                .setCircle(radius)
                .setVisible(false);
            spotObject.name = spot.name;
            spotObject.reward = spot.reward;
            spotObject.url = spot.url;
            spotObject.type = spot.type;
            debugGraphics.strokeCircle(spot.x, spot.y, radius);
        });

        this.anims.create({
            key: 'stand',
            frames: [{ key: 'player_stand' }],
        });
        this.anims.create({
            key: 'walk',
            frames: [{ key: 'player_stand' }, { key: 'player_walk' }],
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

        // ミニゲームから戻ってきたときの報酬受け取り処理
        const urlParams = new URLSearchParams(window.location.search);
        const reward = urlParams.get('reward');
        const isSuccess = urlParams.get('success') === 'true';
        if (reward) {
            if (isSuccess) {
                this.addItem(reward);
            } else {
                alert(`残念！「${reward}」は手に入らなかった…。`);
            }
            // URLからパラメータを消してリロード対策
            window.history.replaceState({}, document.title, window.location.pathname); 
        }

        // ゲーム画面が表示されたとき（＝ミニゲームから戻ってきたとき）に実行される
        const pendingReward = sessionStorage.getItem('pendingReward');
        if (pendingReward) {
            // 保留されていた報酬があれば、アイテムを追加してメッセージを表示
            this.addItem(pendingReward, true);
            // 処理後に削除し、重複を防ぐ
            sessionStorage.removeItem('pendingReward');
        }
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

            if (spot.url) {
                // すぐにミニゲームのURLに移動する
                window.location.href = spot.url;
            } else {
                // URLがないクイズはこちらで処理
                this.scene.pause();
                this.scene.launch('QuizScene', { spotName: spot.name, reward: spot.reward });
            }
        }
    }

    /**
     * アイテムを追加する
     * @param {string} itemName - 追加するアイテム名
     * @param {boolean} [showAlert=true] - trueの場合、alertで通知する
     */
    async addItem(itemName) {
        // game.jsで用意したAPIを呼び出す
        if (window.gameApi && typeof window.gameApi.addItem === 'function') {
            await window.gameApi.addItem(itemName);
            alert(`「${itemName}」を手に入れた！`);
            this.updateItemBox(); // 表示を更新
        }
    }

    async updateItemBox() {
        const itemsDiv = document.getElementById('items');
        itemsDiv.innerHTML = '';
        
        // game.jsから現在のプレイヤー情報を取得
        const player = window.gameApi.getCurrentPlayer();
        
        if (player && player.items) {
            player.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item';
                itemElement.textContent = item;
                itemsDiv.appendChild(itemElement);
            });
        }
    }
}
    