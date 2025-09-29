// 通行不可タイルの定義を削除

export const player = {
    x: 1, y: 1,
    direction: 0,   // 0:下, 1:上, 2:左
    animFrame: 1,   // 0:左足, 1:静止, 2:右足
    isMoving: false,
    steps: 0,
};

// updatePlayerPosition の引数に COLLISION_TILES を追加
export function updatePlayerPosition(keys, dynamicMapData, COLLISION_TILES) {
    if (player.isMoving) return;

    let targetX = player.x;
    let targetY = player.y;
    let moved = false;

    if (keys.ArrowUp) {
        player.direction = 1;
        targetY--;
        moved = true;
    } else if (keys.ArrowDown) {
        player.direction = 0;
        targetY++;
        moved = true;
    } else if (keys.ArrowLeft) {
        player.direction = 2;
        targetX--;
        moved = true;
    } else if (keys.ArrowRight) {
        player.direction = 2; // 右向きは左を反転して使う
        targetX++;
        moved = true;
    }

    if (moved) {
        player.isMoving = true;
        
        // 衝突判定に引数の COLLISION_TILES を使用
        if (!COLLISION_TILES.includes(dynamicMapData[targetY][targetX])) {
            player.x = targetX;
            player.y = targetY;
            player.steps++;
            localStorage.setItem('playerSteps', player.steps.toString());
        }

        // アニメーション
        player.animFrame = player.animFrame === 0 ? 2 : 0;
        
        setTimeout(() => {
            player.isMoving = false;
            player.animFrame = 1;
        }, 200);
    }
}