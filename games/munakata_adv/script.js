document.addEventListener('DOMContentLoaded', () => {
    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    // ストーリーデータ
    // シーンID: { text: "物語", choices: [ { text: "選択肢", next: 次のID } ], result: "win" }
    const storyData = {
        0: {
            text: 'あなたは宗像大社にたどり着いた。三女神の「神宝」を探すため、境内を探索する。まずはどこへ向かう？',
            choices: [
                { text: '大きな本殿に向かう', next: 1 },
                { text: '静かな裏山を探索する', next: 2 }
            ]
        },
        1: {
            text: '本殿に到着した。厳かな雰囲気だ。参拝を済ませると、足元に古い巻物を見つけた。',
            choices: [
                { text: '巻物を開く', next: 3 },
                { text: '神職に届ける', next: 4 }
            ]
        },
        2: {
            text: '裏山に入った。道は険しく、迷ってしまったようだ。目の前に2つの道がある。',
            choices: [
                { text: '明るい光が差す道', next: 5 },
                { text: '古びた鳥居がある道（本殿方面）', next: 1 } // 本殿に戻る
            ]
        },
        3: {
            text: '巻物を開くと、「神宝は高宮にあり」と書かれていた。高宮は裏山にある祭場だ。',
            choices: [
                { text: '裏山（高宮）へ向かう', next: 6 }
            ]
        },
        4: {
            text: '神職に届けると、感謝され、神社の案内図をもらった。どうやら神宝は「高宮」という場所にあるらしい。',
            choices: [
                { text: '地図を頼りに高宮へ向かう', next: 6 }
            ]
        },
        5: {
            text: '明るい道を進んだが、行き止まりだった。どうやらここは違ったようだ。',
            choices: [
                { text: '引き返して本殿に戻る', next: 1 }
            ]
        },
        6: {
            text: '高宮に到着した。ここは宗像三女神が降臨した神聖な場所だ。祭壇の中心に、古びた鏡が置かれている。これが神宝に違いない！',
            choices: [],
            result: 'win' // クリア
        }
    };

    let currentSceneId = 0; // 現在のシーンID

    function showScene(sceneId) {
        const scene = storyData[sceneId];
        
        storyText.textContent = scene.text;
        choicesContainer.innerHTML = ''; // 選択肢をリセット

        if (scene.result === 'win') {
            // クリア処理
            setTimeout(() => {
                document.getElementById('game-container').style.display = 'none';
                resultArea.style.display = 'block';
            }, 1500); // 1.5秒待ってクリア画面表示
            return;
        }

        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                currentSceneId = choice.next;
                showScene(currentSceneId);
            });
            choicesContainer.appendChild(button);
        });
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=交通安全お守り&success=true';
    });

    // ゲーム開始
    showScene(currentSceneId);
});