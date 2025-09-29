// プレイヤーの初期データ
export const player = {
    x: 400,
    y: 300,
    width: 120,
    height: 120,
    speed: 3,
    direction: 'right', // 初期方向
    isMoving: false, // 移動中かどうか
    animFrame: 0, // アニメーションフレーム
    animTimer: 0, // アニメーションタイマー
    animSpeed: 20, // アニメーション速度
    isJumping: false, // ジャンプ中かどうかのフラグ
    jumpVelocity: 0,  // ジャンプの速度
    initialY: 0       // ジャンプ開始前のY座標
};

// プレイヤーの位置を更新する関数
// どのキーが押されているか(keys)と、canvasの情報を引数で受け取る
export function updatePlayerPosition(keys, canvas) {
    player.isMoving = false; // 毎フレーム移動フラグをリセット

    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
        player.isMoving = true;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
        player.isMoving = true;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
        player.direction = 'left'; // 左向きに変更
        player.isMoving = true;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
        player.direction = 'right'; // 右向きに変更
        player.isMoving = true;
    }

    // 移動中はアニメーションタイマーを進める
    if (player.isMoving) {
        player.animTimer++;
        if (player.animTimer >= player.animSpeed) {
            player.animTimer = 0;
            player.animFrame = (player.animFrame + 1) % 2; // フレームを進める
        }
    } else {
        player.animFrame = 0; // 止まっているときはフレームをリセット
    }
}