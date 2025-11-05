document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('quiz-question');
    const choicesContainer = document.getElementById('quiz-choices');
    const scoreElement = document.getElementById('score');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const CLEAR_SCORE = 3; // 3問正解でクリア

    // クイズデータ
    const quizData = [
        {
            question: '主人公、竈門炭治郎が最終選別で戦った「藤襲山（ふじかさねやま）」に咲いていた花は？',
            choices: ['桜の花', '藤の花', '鬼百合', '彼岸花'],
            answer: '藤の花'
        },
        {
            question: '「藤の花」が苦手なのは誰？',
            choices: ['鬼殺隊', '鬼', '隠（かくし）', '育手（そだて）'],
            answer: '鬼'
        },
        {
            question: '「蟲柱」の胡蝶しのぶが使う「蟲の呼吸」の技で、藤の花と関係がある毒を使う技は？',
            choices: ['蝶ノ舞「戯れ」', '蜂牙ノ舞「真靡き」', '蜻蛉ノ舞「複眼六角」', '蜈蚣ノ舞「百足蛇腹」'],
            answer: '蝶ノ舞「戯れ」'
        },
        {
            question: '鬼殺隊の「柱」のうち、出身地が「福岡県」（旧：筑前国）とされているのは誰？',
            choices: ['煉獄杏寿郎', '冨岡義勇', '宇髄天元', '悲鳴嶼行冥'],
            answer: '冨岡義勇'
        },
        {
            question: '藤襲山の最終選別で、炭治郎が斬った「手鬼」が食べてしまった、冨岡義勇の親友の名前は？',
            choices: ['錆兎（さびと）', '鱗滝左近次', '村田', '鋼鐵塚蛍'],
            answer: '錆兎（さびと）'
        }
    ];

    let currentQuizIndex = 0;
    let score = 0;
    let shuffledQuizzes = [];

    // --- ゲームのロジック ---

    // 1. ゲームの初期化
    function startGame() {
        score = 0;
        currentQuizIndex = 0;
        // クイズデータをシャッフルして、毎回違う順番で出す
        shuffledQuizzes = quizData.sort(() => Math.random() - 0.5);
        showQuiz();
    }

    // 2. クイズの表示
    function showQuiz() {
        // 全問解き終わったか、クリアスコアに達したら終了
        if (currentQuizIndex >= shuffledQuizzes.length || score >= CLEAR_SCORE) {
            gameClear();
            return;
        }

        const quiz = shuffledQuizzes[currentQuizIndex];
        questionElement.textContent = quiz.question;
        choicesContainer.innerHTML = ''; // 選択肢をリセット

        quiz.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            
            const handler = (e) => {
                e.preventDefault(); // スマホの重複タップ防止
                checkAnswer(choice, quiz.answer);
            };

            button.addEventListener('click', handler);
            button.addEventListener('touchstart', handler); // スマホ対応
            choicesContainer.appendChild(button);
        });
    }

    // 3. 回答のチェック
    function checkAnswer(selectedChoice, correctAnswer) {
        if (selectedChoice === correctAnswer) {
            // 正解
            score++;
            scoreElement.textContent = score;
            alert('正解！');
        } else {
            // 不正解
            alert(`不正解...\n正解は「${correctAnswer}」でした。`);
        }

        currentQuizIndex++; // 次の問題へ
        showQuiz();
    }

    // 4. ゲームクリア処理
    function gameClear() {
        if (score >= CLEAR_SCORE) {
            questionElement.textContent = '全問正解！クリア！';
            choicesContainer.innerHTML = '';
            resultArea.style.display = 'block';
        } else {
            // 3問正解できずにクイズが尽きた場合
            alert('残念！正解数が足りなかった。\nもう一度挑戦！');
            startGame(); // ゲームをリスタート
        }
    }

    // --- イベントリスナー ---
    backButton.addEventListener('click', () => {
        // spots.js の報酬名に合わせる
        window.location.href = '../../index.html?reward=藤のしおり&success=true';
    });

    // --- ゲーム開始 ---
    startGame();
});