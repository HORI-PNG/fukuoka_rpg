import { GameScene } from './src/scenes/GameScene.js';
import { QuizScene } from './src/scenes/QuizScene.js';

// --- Phaser ゲーム設定 ---
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [GameScene, QuizScene]
};
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_AExrSSQwr2T3h1JjNseMzO3j1MTiJLnqDCYJkvxT5dukoY007kje9x1D_fx25kJWQQ/exec';

/**
 * ログインしているユーザーのデータをFirebaseから取得する
 * @param {string} uid - ユーザーの一意なID
 * @returns {Promise<object>} プレイヤーのデータ
 */
async function getPlayerData(uid) {
    // index.htmlで準備したFirebaseの道具箱から、必要な道具を取り出す
    const { db, doc, getDoc } = window.firebaseTools;
    
    // 'players'というコレクション(棚)から、ユーザーID(uid)という名前のドキュメント(ファイル)を探す
    const playerDocRef = doc(db, 'players', uid);
    const docSnap = await getDoc(playerDocRef);

    if (docSnap.exists()) {
        // もしファイルが存在すれば、その中身を返す
        return docSnap.data();
    } else {
        // なければ、新しいプレイヤー用の初期データを作成して返す
        return {
            name: sessionStorage.getItem('currentPlayerName') || '名無し',
            score: 0,
            items: []
        };
    }
}

/**
 * ゲームを開始し、UIをセットアップする関数
 * @param {object} user - Firebaseの認証ユーザーオブジェクト
 * @param {string} playerName - 入力されたプレイヤー名
 */
async function setupGame(user, playerName) {
    // ユーザーIDと名前を一時的に保存
    sessionStorage.setItem('currentPlayerUID', user.uid);
    sessionStorage.setItem('currentPlayerName', playerName);

    // Firebaseからこのプレイヤーのデータを読み込む
    const playerData = await getPlayerData(user.uid);
    
    // もしデータベースに保存されている名前と入力された名前が違えば、新しい名前で更新する
    if (playerData.name !== playerName) {
        const { db, doc, setDoc } = window.firebaseTools;
        // { merge: true } を付けることで、スコアやアイテムを消さずに名前だけを更新できる
        await setDoc(doc(db, 'players', user.uid), { name: playerName }, { merge: true });
    }

    // 画面の表示を更新
    document.getElementById('current-player').textContent = playerName;
    document.getElementById('current-score').textContent = playerData.score;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-info').style.display = 'block';

    // (リセットボタンの処理は、Firebase化に伴い一旦コメントアウトします。後で復活させます)
}

// --- UI操作 ---
window.addEventListener('load', () => {
    // (ミニゲームからの報酬受け取り処理は変更なし)
    const urlParams = new URLSearchParams(window.location.search);
    const reward = urlParams.get('reward');
    if (reward) {
        sessionStorage.setItem('pendingReward', reward);
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const startButton = document.getElementById('start-button');
    const playerNameInput = document.getElementById('player-name');
    
    // サーバーに接続中であることがわかるように、ボタンを一時的に無効化
    startButton.disabled = true;
    startButton.textContent = 'サーバーに接続中...';

    // ★Firebaseの匿名認証でログインを試みる
    const { auth, signInAnonymously } = window.firebaseTools;
    signInAnonymously(auth)
        .then((userCredential) => {
            // ログインに成功！
            const user = userCredential.user;
            console.log("匿名認証に成功しました。ユーザーID:", user.uid);
            
            // スタートボタンを押せるようにする
            startButton.disabled = false;
            startButton.textContent = 'ゲームを開始する';

            // スタートボタンがクリックされたときの処理
            startButton.addEventListener('click', () => {
                const playerName = playerNameInput.value;
                if (!playerName) {
                    alert('プレイヤー名を入力してください。');
                    return;
                }
                // 取得したユーザー情報とプレイヤー名でゲームを開始
                setupGame(user, playerName);
            });
        })
        .catch((error) => {
            // ログインに失敗した場合
            console.error("匿名認証エラー:", error);
            startButton.textContent = '接続に失敗しました';
            alert("サーバーへの接続に失敗しました。ページを再読み込みしてください。");
        });
    
    // (アイテムボックス表示の処理は変更なし)
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'e') {
            const itemBox = document.getElementById('item-box');
            itemBox.style.display = itemBox.style.display === 'block' ? 'none' : 'block';
        }
    });
});