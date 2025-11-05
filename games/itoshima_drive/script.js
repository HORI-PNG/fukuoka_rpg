document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('quiz-question');
    const choicesContainer = document.getElementById('quiz-choices');
    const scoreElement = document.getElementById('score');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const CLEAR_SCORE = 3; // 3問正解でクリア

    // クイズデータ (道路交通法)
    const quizData = [
        {
            question: '2023年4月から、自転車に乗るすべての人に「ある装備」の着用が努力義務化されました。それは何？',
            choices: ['ヘルメット', 'サングラス', '手袋', '鈴'],
            answer: 'ヘルメット'
        },
        {
            question: '信号が「赤色」の点滅をしている時、車や自転車はどうしなければならない？',
            choices: ['注意してそのまま進む', '必ず一時停止し、安全を確認して進む', '青になるまで待つ', 'すぐに引き返す'],
            answer: '必ず一時停止し、安全を確認して進む'
        },
        {
            question: '「特定小型原動機付自転車」（電動キックボードなど）は、原則として何歳以上であれば運転免許がなくても運転できる？',
            choices: ['12歳以上', '16歳以上', '18歳以上', '年齢制限はない'],
            answer: '16歳以上'
        },
        {
            question: '横断歩道に歩行者がいる時、車はどうするのが正しい？',
            choices: ['歩行者に注意して通過する', '警音器（クラクション）を鳴らして知らせる', '一時停止して歩行者に道を譲る', 'ライトを点滅させて通過する'],
            answer: '一時停止して歩行者に道を譲る'
        },
        {
            question: '「飲酒運転」は、法律でどう定められている？',
            choices: ['少しなら飲んでも良い', '絶対に禁止されている', 'ビール1杯までなら良い', '自転車なら問題ない'],
            answer: '絶対に禁止されている'
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
        shuffledQuizzes = quizData.sort(() => Math.random() - 0.5);
        showQuiz();
    }

    // 2. クイズの表示
    function showQuiz() {
        if (currentQuizIndex >= shuffledQuizzes.length || score >= CLEAR_SCORE) {
            gameClear();
            return;
        }

        const quiz = shuffledQuizzes[currentQuizIndex];
        questionElement.textContent = quiz.question;
        choicesContainer.innerHTML = '';

        quiz.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            
            const handler = (e) => {
                e.preventDefault(); 
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
            score++;
            scoreElement.textContent = score;
            alert('正解！');
        } else {
            alert(`不正解...\n正解は「${correctAnswer}」でした。`);
        }

        currentQuizIndex++;
        showQuiz();
    }

    // 4. ゲームクリア処理
    function gameClear() {
        if (score >= CLEAR_SCORE) {
            questionElement.textContent = '全問正解！安全運転ですね！';
            choicesContainer.innerHTML = '';
            resultArea.style.display = 'block';
        } else {
            alert('残念！正解数が足りなかった。\nもう一度挑戦！');
            startGame();
        }
    }

    // --- イベントリスナー ---
    backButton.addEventListener('click', () => {
        // spots.js の報酬名に合わせる
        window.location.href = '../../index.html?reward=貝殻&success=true';
    });

    // --- ゲーム開始 ---
    startGame();
});