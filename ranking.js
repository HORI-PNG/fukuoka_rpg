// window.firebaseTools が準備できるまで待つための処理
function waitForFirebase() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (window.firebaseTools) {
                clearInterval(interval);
                resolve(window.firebaseTools);
            }
        }, 100); // 0.1秒ごとにチェック
    });
}

const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_AExrSSQwr2T3h1JjNseMzO3j1MTiJLnqDCYJkvxT5dukoY007kje9x1D_fx25kJWQQ/exec';

// ページの読み込みが完了したら、ランキングの表示処理を開始
document.addEventListener('DOMContentLoaded', async () => {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<li>ランキングを読み込み中...</li>';

    try {
        // Firebaseの準備が整うのを待つ
        const { db, collection, query, orderBy, limit, getDocs } = await waitForFirebase();

        // 'players'コレクションを、スコア(score)が高い順(desc)に、上位10件(limit)取得するクエリを作成
        const q = query(collection(db, "players"), orderBy("score", "desc"), limit(10));

        const querySnapshot = await getDocs(q);
        
        // ランキングリストを一度空にする
        rankingList.innerHTML = ''; 

        if (querySnapshot.empty) {
            rankingList.innerHTML = '<li>まだ誰もプレイしていません。</li>';
            return;
        }

        let rank = 1;
        querySnapshot.forEach((doc) => {
            const playerData = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `${rank}位: ${playerData.name} - ${playerData.score}ポイント`;
            rankingList.appendChild(listItem);
            rank++;
        });

    } catch (error) {
        console.error("ランキングの読み込みに失敗しました:", error);
        rankingList.innerHTML = '<li>ランキングの読み込みに失敗しました。</li>';
    }
});