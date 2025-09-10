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
}