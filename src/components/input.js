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

    for (const [buttonId, key] of Object.entries(controlMapping)) {
        const button = document.getElementById(buttonId);
        if (button) {
            const startMoving = (e) => {
                e.preventDefault();
                keys[key] = true;
            };
            const stopMoving = (e) => {
                e.preventDefault();
                keys[key] = false;
            };

            button.addEventListener('mousedown', startMoving);
            button.addEventListener('mouseup', stopMoving);
            button.addEventListener('mouseleave', stopMoving);
            button.addEventListener('touchstart', startMoving);
            button.addEventListener('touchend', stopMoving);
        }
    }
}