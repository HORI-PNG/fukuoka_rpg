document.addEventListener('DOMContentLoaded', () => {
    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const quizData = [
        {
            question: '問1：アリスやユージオ達が暮らしていた村の名前は？',
            choices: [
                { text: 'ルーリッド', correct: true },
                { text: 'ザッカリア', correct: false },
                { text: 'セントリア', correct: false },
            ]
        },
        {
            question: '問2：ノーランガルス帝立修剣学院主席ウォロ・リーバンテインは何流剣術の使い手だったか？',
            choices: [
                { text: 'ハイ・ノルキア流', correct: true },
                { text: 'アインクラッド流', correct: false },
                { text: 'セラルート流', correct: false },
            ]
        },
        {
            question: '問3：右目の封印「システム・アラート」のコードナンバーは？',
            choices: [
                { text: 'Code 871', correct: true },
                { text: 'Code 823', correct: false },
                { text: 'Code 812', correct: false },
            ]
        },
        {
            question: '問4：アリスとキリト・ユージオが剣を交えたのは、セントラルカセドラルの何階？',
            choices: [
                { text: '75階', correct: false },
                { text: '80階', correct: true },
                { text: '85階', correct: false },
            ]
        },
        {
            question: '問5：キリトがソルティリーナの卒業祝いに送った花の名前は？',
            choices: [
                { text: 'ゼフィリア', correct: true },
                { text: 'カトレア', correct: false },
                { text: 'シノグロッサム', correct: false },
            ]
        }
    ];

    let currentQuestionIndex = 0; // 現在の問題番号

    function showQuestion(index) {
        
        // 全問正解した場合 (indexが5になったら)
        if (index >= quizData.length) {
            storyText.innerHTML = "全問正解！<br>おめでとう！";
            choicesContainer.innerHTML = ''; // 選択肢を消す
            setTimeout(() => {
                document.getElementById('game-container').style.display = 'none';
                resultArea.style.display = 'block';
            }, 2000);
            return; // 関数を終了
        }

        const scene = quizData[index];
        
        storyText.innerHTML = scene.question.replace(/\n/g, '<br>');
        choicesContainer.innerHTML = '';

        // --- 選択肢の表示 ---
        // 選択肢をシャッフルして表示
        const shuffledChoices = [...scene.choices].sort(() => Math.random() - 0.5);

        shuffledChoices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                
                if (choice.correct === true) {
                    // ★正解なら、次の問題へ
                    alert('正解！');
                    currentQuestionIndex++;
                    showQuestion(currentQuestionIndex);
                } else {
                    // ★不正解なら、リロード（やり直し）
                    alert('不正解...。最初からやり直し！');
                    window.location.reload();
                }
            });
            choicesContainer.appendChild(button);
        });
    }

    // マップに戻るボタンの処理 (報酬名は元のままです)
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=縁結びのお守り&success=true';
    });

    // ゲーム開始 (最初の問題を表示)
    showQuestion(currentQuestionIndex);
});