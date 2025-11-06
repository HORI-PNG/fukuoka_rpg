document.addEventListener('DOMContentLoaded', () => {
    const storyText = document.getElementById('story-text');
    const choicesContainer = document.getElementById('choices-container');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    // ★クリアに必要なスコア
    const CLEAR_SCORE = 3;

    // ★ご指定のテーマでクイズデータを作成
    const quizData = [
        {
            question: '問1：名前の由来が「あかい・まるい・おおきい・うまい」である、福岡県産の有名なイチゴの品種は？',
            choices: [
                { text: 'あまおう', correct: true },
                { text: 'とよのか', correct: false },
                { text: 'ゆうべに', correct: false },
            ]
        },
        {
            question: '問2：毎年7月に開催され、「オイサ」の掛け声で「山笠（やま）」を担いで街を走る、福岡の有名なお祭りは？',
            choices: [
                { text: '博多祇園山笠', correct: true },
                { text: '博多どんたく', correct: false },
                { text: '放生会（ほうじょうや）', correct: false },
            ]
        },
        {
            question: '問3：「1000年に1人の逸材」として有名になった、福岡県出身のアイドル・女優は？',
            choices: [
                { text: '今田美桜', correct: false },
                { text: '与田祐希 (乃木坂46)', correct: false },
                { text: '橋本環奈', correct: true },
            ]
        },
        {
            question: '問4：【ホークス問題】2024年シーズンに、投手でありながら盗塁を決め、「40歳以上でのシーズン盗塁」を達成した選手は誰？',
            choices: [
                { text: '有原航平', correct: false },
                { text: '和田毅', correct: true },
                { text: 'L.モイネロ', correct: false },
            ]
        }
    ];

    let currentQuestionIndex = 0; // 現在の問題番号
    let score = 0; // 現在の正解数
    
    // ★クイズデータをシャッフル（毎回出題順が変わる）
    const shuffledQuizzes = quizData.sort(() => Math.random() - 0.5);

    function showQuestion(index) {
        
        // ★4問解き終わったら結果判定
        if (index >= shuffledQuizzes.length) {
            gameResult();
            return;
        }

        const scene = shuffledQuizzes[index];
        
        // ★ステータス表示（何問目 / 現在のスコア）
        storyText.innerHTML = `【${index + 1}問目 / 全${shuffledQuizzes.length}問】 (現在 ${score} 問正解)<br><br>${scene.question.replace(/\n/g, '<br>')}`;
        choicesContainer.innerHTML = '';

        // 選択肢をシャッフルして表示
        const shuffledChoices = [...scene.choices].sort(() => Math.random() - 0.5);

        shuffledChoices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                
                if (choice.correct === true) {
                    // ★正解ならスコア加算
                    alert('正解！');
                    score++;
                } else {
                    // ★不正解
                    alert('不正解...');
                }
                
                // 次の問題へ
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            });
            choicesContainer.appendChild(button);
        });
    }

    // ★結果判定処理を追加
    function gameResult() {
        if (score >= CLEAR_SCORE) {
            // クリア
            storyText.innerHTML = `おめでとう！<br>全${shuffledQuizzes.length}問中 ${score}問正解でクリアです！`;
            choicesContainer.innerHTML = '';
            setTimeout(() => {
                document.getElementById('game-container').style.display = 'none';
                resultArea.style.display = 'block';
            }, 2000);
        } else {
            // 失敗
            alert(`残念！ ${score}問正解でした。\n${CLEAR_SCORE}問正解でクリアです。\nもう一度挑戦しよう！`);
            window.location.reload();
        }
    }


    // マップに戻るボタンの処理 (報酬は「交通安全お守り」のままです)
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=交通安全お守り&success=true';
    });

    // ゲーム開始 (最初の問題を表示)
    showQuestion(currentQuestionIndex);
});