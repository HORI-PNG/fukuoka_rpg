const omikujiScreen = document.getElementById('omikuji-screen');
const drawButton = document.getElementById('draw-omikuji-button');
const omikujiResult = document.getElementById('omikuji-result');
const fortuneText = document.getElementById('fortune-text');

const quizScreen = document.getElementById('quiz-screen');
const quizQuestion = document.getElementById('quiz-question');
const quizChoices = document.getElementById('quiz-choices');

const resultArea = document.querySelector('.result-area');
const backButton = document.getElementById('back-to-map');

// 運勢ごとのクイズデータ
const quizzes = {
    '大吉': {
        question: '菅原道真公が京都から太宰府へ左遷された理由は、政敵の陰謀とされています。その政敵とは誰？',
        choices: ['藤原時平', '平清盛', '源頼朝'],
        answer: '藤原時平'
    },
    '中吉': {
        question: '太宰府天満宮の本殿前にある、撫でると知恵を授かると言われている牛の像の名前は？',
        choices: ['御神牛（ごしんぎゅう）', '知恵の牛', '天満牛'],
        answer: '御神牛（ごしんぎゅう）'
    },
    '小吉': {
        question: '太宰府天満宮で有名な、菅原道真公を慕って京都から一晩で飛んできたとされる木は？',
        choices: ['飛梅（とびうめ）', '桜', '松'],
        answer: '飛梅（とびうめ）'
    }
};

// おみくじを引くボタンの処理
drawButton.addEventListener('click', () => {
    const fortunes = ['大吉', '中吉', '小吉'];
    const selectedFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    // 結果を表示
    fortuneText.textContent = selectedFortune;
    omikujiResult.style.display = 'block';
    drawButton.style.display = 'none'; // ボタンを非表示に

    // 2秒後にクイズを表示
    setTimeout(() => {
        omikujiScreen.style.display = 'none';
        showQuiz(selectedFortune);
    }, 2000);
});

// クイズを表示する関数
function showQuiz(fortune) {
    const quiz = quizzes[fortune];
    
    quizQuestion.textContent = quiz.question;
    quizChoices.innerHTML = ''; // 選択肢をリセット

    quiz.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.addEventListener('click', () => checkAnswer(choice, quiz.answer));
        quizChoices.appendChild(button);
    });

    quizScreen.style.display = 'block';
}

// 回答をチェックする関数
function checkAnswer(selectedChoice, correctAnswer) {
    if (selectedChoice === correctAnswer) {
        // 正解
        quizScreen.style.display = 'none';
        resultArea.style.display = 'block';
    } else {
        // 不正解
        alert('不正解！残念！\nもう一度おみくじからやり直してください。');
        window.location.reload(); // ページをリロードして最初から
    }
}

// マップに戻るボタンの処理
backButton.addEventListener('click', () => {
    // ★重要：報酬と成功フラグを付けてマップ画面に戻る
    // 報酬名は spots.js に合わせて「梅ヶ枝餅」とします
    window.location.href = '../../index.html?reward=梅ヶ枝餅&success=true';
});