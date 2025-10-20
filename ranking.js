const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby_AExrSSQwr2T3h1JjNseMzO3j1MTiJLnqDCYJkvxT5dukoY007kje9x1D_fx25kJWQQ/exec';

document.addEventListener('DOMContentLoaded', async () => {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return; // ranking.html以外では何もしない
    rankingList.innerHTML = '<li>ランキングを読み込み中...</li>';

    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getRanking`);
        const result = await response.json();

        if (result.status !== 'success' || !result.data) {
            throw new Error(result.message || 'データの取得に失敗しました。');
        }

        const rankingData = result.data;
        rankingList.innerHTML = '';

        if (rankingData.length === 0) {
            rankingList.innerHTML = '<li>まだ誰もプレイしていません。</li>';
            return;
        }

        rankingData.forEach((player, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}位: ${player.name} - ${player.score}ポイント`;
            rankingList.appendChild(listItem);
        });

    } catch (error) {
        console.error("ランキングの読み込みに失敗しました:", error);
        rankingList.innerHTML = '<li>ランキングの読み込みに失敗しました。</li>';
    }
});