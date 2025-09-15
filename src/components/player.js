// 通行不可タイル
const COLLISION_TILES = [1, 2];

export const player = {
    x: 1, y: 1,
    direction: 0,   // 0:下, 1:上, 2:左
    animFrame: 1,   // 0:左足, 1:静止, 2:右足
    isMoving: false,
};

export function updatePlayerPosition(keys, mapData) {
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
        
        // 衝突判定
        if (!COLLISION_TILES.includes(mapData[targetY][targetX])) {
            player.x = targetX;
            player.y = targetY;
        }

        // アニメーション
        player.animFrame = player.animFrame === 0 ? 2 : 0;
        
        setTimeout(() => {
            player.isMoving = false;
            player.animFrame = 1;
        }, 200);
    }
}