// キー入力の状態を管理するオブジェクト
export const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// キー入力の初期設定を行う関数
export function initializeInput() {
    // キーが押された時の処理
    document.addEventListener('keydown', (e) => {
        if (e.key in keys) {
            keys[e.key] = true;
        }
    });

    // キーが離された時の処理
    document.addEventListener('keyup', (e) => {
        if (e.key in keys) {
            keys[e.key] = false;
        }
    });

    const controlMapping = {
        'btn-up': 'ArrowUp',
        'btn-down': 'ArrowDown',
        'btn-left': 'ArrowLeft',
        'btn-right': 'ArrowRight'
    };

    for (const [btnId, key] of Object.entries(controlMapping)) {
        const btn = document.getElementById(btnId);
        if (btn) {
            const startMoving = (e) => {
                e.preventDefault();
                keys[key] = true;
            };
            const stopMoving = (e) => {
                e.preventDefault();
                keys[key] = false;
            };

            btn.addEventListener('mousedown', startMoving);
            btn.addEventListener('mouseup', stopMoving);
            btn.addEventListener('mouseleave', stopMoving);
            btn.addEventListener('touchstart', startMoving);
            btn.addEventListener('touchend', stopMoving);
        }
    }
}