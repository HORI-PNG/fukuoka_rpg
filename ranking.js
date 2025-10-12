document.addEventListener('DOMContentLoaded', () => {
    const rankingList = document.getElementById('ranking-list');

    // ローカルストレージからスコアを取得
    const scores = JSON.parse(localStorage.getItem('gameScores')) || {};

    // スコアを配列に変換して、降順（ポイントの高い順）にソート
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

    // 上位3名を表示
    const top3 = sortedScores.slice(0, 3);

    if (top3.length === 0) {
        rankingList.innerHTML = '<li>まだ誰もプレイしていません。</li>';
    } else {
        top3.forEach(([name, score], index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}位: ${name} - ${score}ポイント`;
            rankingList.appendChild(listItem);
        });
    }
});