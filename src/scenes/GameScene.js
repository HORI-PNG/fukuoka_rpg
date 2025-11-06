import { spots } from '../data/spots.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.virtualKeys = { up: false, down: false, left: false, right: false };
        this.isEnteringSpot = false; // スポットに入ったかどうかのフラグ
    }

    preload() {
        this.load.image('map', './assets/fukuoka_map_1.png');
        this.load.image('player_stand', './assets/player_icon_1_shadow.png');
        this.load.image('player_walk', './assets/player_icon_2_shadow.png');
    }

    create() {
        const map = this.add.image(400, 300, 'map');
        map.setDisplaySize(800, 600);
        map.setDepth(0); // 背景なので最も奥に配置

        // 訪問済スポットの色を定義
        const visitedColor = 0xffaaaa; // 薄い赤色

        // 新しい色の定義
        const friendlyColor = 0xd0e43b; // スマホ向き
        const complexColor = 0x67afe3;  // スマホ不向き
        const hobbyColor = 0x8c4bf5;   // 趣味・その他


        // 現在のプレイヤーの訪問履歴を取得
        const currentPlayer = window.gameApi.getCurrentPlayer();
        const visitedSpots = currentPlayer ? (currentPlayer.visited_spots || []) : [];
        
        // 各スポットごとにGraphicsオブジェクトを作成
        this.spotObjects = this.physics.add.staticGroup();
        spots.forEach(spot => {
            // スポットごとに個別のGraphicsオブジェクトを作成
            const spotGraphic = this.add.graphics();
            spotGraphic.setDepth(1); // プレイヤーより後ろ、マップより前に配置

            // ここから色分けロジックを変更
            let spotColor;
            const isVisited = visitedSpots.includes(spot.name);

            if (isVisited) {
                spotColor = visitedColor; // 訪問済みは赤
            } else {
                // spot.mobileFriendly が false なら青、それ以外（trueまたは未定義）なら緑
                if (spot.mobileFriendly === false) {
                    spotColor = complexColor; // スマホ不向き
                } else if (spot.mobileFriendly === true) {
                    spotColor = friendlyColor; // スマホ向き
                } else {
                    spotColor = hobbyColor; // 趣味・その他
                }
            }
            
            spotGraphic.fillStyle(spotColor, 0.5); // 50%で透過
            const drawX = spot.x - spot.width / 2;
            const drawY = spot.y - spot.height / 2;
            spotGraphic.fillRect(drawX, drawY, spot.width, spot.height);

            // 物理判定用の見えないオブジェクトを作成
            const spotObject = this.spotObjects.create(spot.x, spot.y, null)
                .setSize(spot.width, spot.height)
                .setVisible(false);
            spotObject.name = spot.name;
            spotObject.reward = spot.reward;
            spotObject.url = spot.url;
            spotObject.type = spot.type;
            spotObject.mobileFriendly = spot.mobileFriendly; // ★追加： 情報を引き継ぐ

            // 作成した Graphics を spotObject に関連付けておく (後で色を変える場合など)
            spotObject.graphic = spotGraphic;
            // 当たり判定のサイズも保存しておくとonSpotOverlapで便利
            spotObject.width = spot.width; // spot.jsのwidthを保持
            spotObject.height = spot.height; // spot.jsのheightを保持
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
        this.player.setSize(10, 10);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(2); // プレイヤーは一番前

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D');
        this.setupButtonEvents();

        this.physics.add.overlap(this.player, this.spotObjects, this.onSpotOverlap, null, this);
        
        // ゲーム開始時に updateItemBox を呼ぶ（game.js側で呼ばれるが念のため）
        this.updateItemBox();

        // ミニゲームから戻ってきたときの報酬受け取り処理
        const urlParams = new URLSearchParams(window.location.search);
        const reward = urlParams.get('reward');
        const isSuccess = urlParams.get('success') === 'true';
        if (reward) {
            if (isSuccess) {
                this.addItem(reward); // Supabase にアイテムを追加
                // ★追加： スコアも加算
                if (window.gameApi && typeof window.gameApi.updateScore === 'function') {
                    window.gameApi.updateScore(1);
                }
            } else {
                alert(`残念！「${reward}」は手に入らなかった…。`);
            }
            // URLからパラメータを消してリロード対策
            window.history.replaceState({}, document.title, window.location.pathname); 
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

    // onSpotOverlap を Supabase の訪問履歴（visited_spots）を参照するように変更
    // onSpotOverlap を多重実行防止版に修正
    async onSpotOverlap(player, spot) {
        // 既にシーン遷移中、またはプレイヤーAPIがなければ何もしない
        if (this.isEnteringSpot || !window.gameApi) return;

        const currentPlayer = window.gameApi.getCurrentPlayer();
        if (!currentPlayer) return; // プレイヤー情報がなければ何もしない

        // プレイヤーの訪問履歴（Supabaseからロードしたもの）をチェック
        const visitedSpots = currentPlayer.visited_spots || [];
        const hasVisited = visitedSpots.includes(spot.name);

        if (!hasVisited) {
            // フラグを立てて、多重実行を防ぐ
            this.isEnteringSpot = true;

            // スポットの色を即座に変更
            if (spot.graphic) { // ★修正： spot.spotGraphic -> spot.graphic
                const visitedColor = 0xffaaaa; // 薄い赤色
                spot.graphic.clear(); // 既存の描画をクリア
                spot.graphic.fillStyle(visitedColor, 0.5);
                // create時と同様に、中心座標から描画開始位置を計算
                const drawX = spot.x - spot.width / 2;
                const drawY = spot.y - spot.height / 2;
                spot.graphic.fillRect(drawX, drawY, spot.width, spot.height);
            }

            // 訪問履歴をDBに保存するAPI（game.js）を呼び出す
            // async関数だが、ここでは完了を待たずに進める (awaitしない)
            if (window.gameApi && typeof window.gameApi.addVisitedSpot === 'function') {
                try {
                    await window.gameApi.addVisitedSpot(spot.name);
                } catch (error) {
                    console.error('訪問履歴の保存に失敗しました:', error);
                    this.isEnteringSpot = false;
                }
            }

            // 保存が終わってからシーン遷移
            if (spot.url) {
                // ミニゲームへ遷移 (ページがリロードされるのでフラグは自動解除)
                window.location.href = spot.url;
                setTimeout(() => {
                    this.isEnteringSpot = false;
                }, 3000);
                // 遷移後もisEnteringSpotがtrueのままにならないよう、念のためfalseに戻す
                // (遷移に失敗した場合への対策)
                // this.isEnteringSpot = false; // ← 通常は不要だが、保険として入れても良い
            } else {
                // クイズシーンへ遷移 (GameSceneは pause されるだけ)
                this.scene.pause();
                // クイズシーンが終了(shutdown)したら、フラグを解除するリスナーを設定
                // QuizSceneが存在することを確認してからリスナーを設定
                const quizScene = this.scene.get('QuizScene');
                if (quizScene) {
                    quizScene.events.once('shutdown', () => {
                        this.isEnteringSpot = false;
                        // GameSceneを再開する（resume）必要があればここに追加
                        // this.scene.resume(); // QuizScene.js側でresumeしているなら不要
                    });
                } else {
                    // QuizSceneが見つからない場合のエラー処理（念のため）
                    console.error('QuizSceneが見つかりません。');
                    this.isEnteringSpot = false;
                }
                this.scene.launch('QuizScene', { spotName: spot.name, reward: spot.reward });
            }
        }
    }
    /**
     * アイテムを追加する
     * @param {string} itemName - 追加するアイテム名
     */
    async addItem(itemName) {
        // game.jsで用意したAPIを呼び出す
        if (window.gameApi && typeof window.gameApi.addItem === 'function') {
            await window.gameApi.addItem(itemName);
            alert(`「${itemName}」を手に入れた！`);
        }
    }

    async updateItemBox() {
        // (この関数は game.js から直接呼ばれることはないが、
        //  create() や addItem() から呼ばれるため残しておく)
        const itemsDiv = document.getElementById('items');
        itemsDiv.innerHTML = '';

        // game.jsから現在のプレイヤー情報を取得
        const player = window.gameApi.getCurrentPlayer();

        if (player && Array.isArray(player.items)) {
            player.items.forEach(itemName => {
                const itemElement = document.createElement('div');
                itemElement.className = 'item';
                itemElement.textContent = itemName;
                itemsDiv.appendChild(itemElement);
            });
        }
    }
}