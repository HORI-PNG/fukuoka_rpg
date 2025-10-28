const SUPABASE_URL = 'https://ztuuvaubrldzhgmbcfcm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0dXV2YXVicmxkemhnbWJjZmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTM2MDUsImV4cCI6MjA3NzE4OTYwNX0.lJZp8kyVeryJ2CDPqRZnkFOQvGb_kFhBHKBb3rptTpA';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return; // ranking.html以外では何もしない
    rankingList.innerHTML = '<li>ランキングを読み込み中...</li>';

    try {
        // supabaseからランキングデータを取得
        const { data: rankingData, error } = await supabase
            .from('players')
            .select('name, score')
            .order('score', { ascending: false })
            .limit(10);
        if (error) {
            throw error;
        }
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