// HTML要素の取得
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const resultArea = document.getElementById('result-area');
const resultMessage = document.getElementById('result-message');
const actionButton = document.getElementById('action-button');

// クイズデータ
const quizzes = [
    {
        question: '太宰府天満宮で祀られている「学問の神様」は誰？',
        answers: ['聖徳太子', '菅原道真', '徳川家康', '空海'],
        correct: '菅原道真'
    },
    {
        question: '太宰府天満宮の名物で、食べると病気を防ぐと言われるお餅は？',
        answers: ['きびだんご', '赤福', '梅ヶ枝餅', '八ツ橋'],
        correct: '梅ヶ枝餅'
    },
    {
        question: '菅原道真公を慕って、京から一夜にして飛んできたという伝説の梅の名前は？',
        answers: ['飛梅', '見驚梅', '魁梅', '思いのまま'],
        correct: '飛梅'
    }
];
const WINNING_SCORE = 2;
let currentQuizIndex = 0;
let score = 0;

// クイズを表示する関数
function showQuiz() {
    // 以前の答えをクリア
    answersElement.innerHTML = '';

    // クイズが終了した場合
    if (currentQuizIndex >= quizzes.length) {
        showResult();
        return;
    }
    
    const currentQuiz = quizzes[currentQuizIndex];
    questionElement.textContent = currentQuiz.question;
    
    currentQuiz.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answersElement.appendChild(button);
    });
}

// 回答を選択したときの処理
function selectAnswer(selected) {
    if (selected === quizzes[currentQuizIndex].correct) {
        score++;
    }
    currentQuizIndex++;
    showQuiz();
}

// 結果を表示する関数
function showResult() {
    questionElement.style.display = 'none';
    answersElement.style.display = 'none';

    if (score >= WINNING_SCORE) {
        resultMessage.textContent = `合格！${quizzes.length}問中 ${score}問正解！`;
        actionButton.textContent = 'マップに戻る';
        actionButton.onclick = () => {
            window.location.href = '../../index.html?reward=梅ヶ枝餅';
        };
    } else {
        resultMessage.textContent = `不合格...${quizzes.length}問中 ${score}問正解。`;
        actionButton.textContent = 'もう一度挑戦';
        actionButton.onclick = () => {
            window.location.reload();
        };
    }
    resultArea.style.display = 'block';
}

// 最初のクイズを表示
showQuiz();