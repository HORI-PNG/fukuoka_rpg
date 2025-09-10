// プレイヤーの初期データ
export const player = {
    x: 400,
    y: 300,
    width: 32,
    height: 32,
    speed: 5
};

// プレイヤーの位置を更新する関数
// どのキーが押されているか(keys)と、canvasの情報を引数で受け取る
export function updatePlayerPosition(keys, canvas) {
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}