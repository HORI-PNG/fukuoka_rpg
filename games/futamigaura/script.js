document.addEventListener('DOMContentLoaded', () => {
    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    // シナリオデータ
    const storyData = {
        0: {
            text: '夕日が沈みかけている。白い鳥居が美しい。隣には意中の人がいる...！\nさあ、なんと声をかける？',
            choices: [
                { text: '「今日の夕日、すごく綺麗だね。」', next: 1 },
                { text: '「...（黙って夕日を見つめる）」', next: 2 },
                { text: '「ねえ、寒いから早く帰らない？」', next: 3 }
            ]
        },
        1: {
            text: '相手：「本当だね...。こんな素敵な景色、〇〇さんと見れてよかった。」\n（いい雰囲気だ！あと一押し！）',
            choices: [
                // ★修正： next: 'win' ではなく、result: 'win' を使う
                { text: '「俺（私）もだよ。...ずっと一緒にいたいな。」', result: 'win' },
                { text: '「あ、あれカモメかな？（照れ隠し）」', next: 4 }
            ]
        },
        2: {
            text: '相手：「...（何か言いたそうだが、黙っている）」\n（気まずい雰囲気になってしまった...）',
            choices: [
                { text: '「ごめん、何か考え事してた！」', next: 1 },
                { text: '「...（帰りたくないな）」', next: 3 }
            ]
        },
        3: {
            text: '相手：「えっ...。そ、そうだね。」\n（完全にムードが壊れてしまった...最初からやり直そう！）',
            choices: [],
            result: 'lose'
        },
        4: {
            text: '相手：「え？どこどこ？...あ、本当だ。」\n（...せっかくの雰囲気が台無しになってしまった。やり直し！）',
            choices: [],
            result: 'lose'
        }
    };

    // ★修正：関数全体を修正
    function showScene(sceneId) {
        
        // ★追加： 'win' が渡された場合は、ここでクリア処理
        if (sceneId === 'win') {
            storyText.innerHTML = "相手：「...！ はいっ...！（告白成功だ！）」";
            choicesContainer.innerHTML = ''; // 選択肢を消す
            setTimeout(() => {
                document.getElementById('game-container').style.display = 'none';
                resultArea.style.display = 'block';
            }, 2000);
            return; // 関数を終了
        }

        const scene = storyData[sceneId];
        
        storyText.innerHTML = scene.text.replace(/\n/g, '<br>');
        choicesContainer.innerHTML = '';

        // --- 結果の判定 (lose) ---
        if (scene.result === 'lose') {
            setTimeout(() => {
                alert('告白失敗...。もう一度チャンスを！');
                window.location.reload();
            }, 1500);
            return;
        }

        // --- 選択肢の表示 ---
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                
                // ★修正： 押された選択肢に result: 'win' があるかチェック
                if (choice.result === 'win') {
                    showScene('win'); // 'win' を渡してクリア処理を呼び出す
                } else {
                    // それ以外なら next に進む
                    showScene(choice.next);
                }
            });
            choicesContainer.appendChild(button);
        });
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=縁結びのお守り&success=true';
    });

    // ゲーム開始
    showScene(0);
});