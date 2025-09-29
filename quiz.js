// 既存のクイズデータをインポート
import { quizzes } from './src/data/quizzes.js';

/**
 * 全プレイヤーのスコアデータを取得する
 * @returns {Object} プレイヤー名をキー、スコアを値とするオブジェクト
 */
function getScores() {
    const scores = localStorage.getItem('gameScores');
    return scores ? JSON.parse(scores) : {};
}

/**
 * スコアを保存する
 * @param {string} playerName - スコアを保存するプレイヤー名
 * @param {number} points - 加算するポイント
 */
function saveScore(playerName, points) {
    const scores = getScores();
    if (scores[playerName]) {
        scores[playerName] += points;
    } else {
        scores[playerName] = points;
    }
    localStorage.setItem('gameScores', JSON.stringify(scores));
}


// ページの読み込みが完了したら、中の処理を実行する
document.addEventListener('DOMContentLoaded', () => {
    // URLからスポット名や報酬の情報を取得
    const urlParams = new URLSearchParams(window.location.search);
    const spotName = urlParams.get('spot');
    const reward = urlParams.get('reward');
    const quizData = quizzes[spotName];

    // HTMLの要素を取得
    const spotNameEl = document.getElementById('spot-name');
    const questionEl = document.getElementById('question');
    const choicesEl = document.getElementById('choices');
    const resultEl = document.getElementById('result-container');
    const backBtn = document.getElementById('back-to-game');

    // もしクイズデータが見つからなかったらエラー表示
    if (!quizData) {
        spotNameEl.textContent = 'エラー';
        questionEl.textContent = 'クイズが見つかりませんでした。';
        return;
    }

    // クイズ情報を画面に表示
    spotNameEl.textContent = `クイズ：${spotName}`;
    questionEl.textContent = quizData.question;

    // 選択肢のボタンを作成して画面に追加
    quizData.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.className = 'choice-btn';
        button.addEventListener('click', () => checkAnswer(choice));
        choicesEl.appendChild(button);
    });

    // 答えをチェックする関数
    function checkAnswer(selectedChoice) {
        // すべての選択肢ボタンを押せないようにする
        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);

        // ゲーム画面からプレイヤー名を取得
        const currentPlayer = sessionStorage.getItem('currentPlayer');

        if (selectedChoice === quizData.correctAnswer) {
            resultEl.textContent = '正解！ 🎉 10ポイント獲得！';
            
            // ポイントを加算して保存
            if (currentPlayer) {
                saveScore(currentPlayer, 10); // 1問正解で10ポイント
            }

            // ゲームに戻ったときに報酬がもらえるようにURLを組み立てる
            backBtn.dataset.returnUrl = `index.html?reward=${encodeURIComponent(reward)}`;
        } else {
            resultEl.textContent = `残念、不正解... 正解は「${quizData.correctAnswer}」でした。`;
            backBtn.dataset.returnUrl = 'index.html'; // 不正解なので報酬なし
        }

        // 「ゲームに戻る」ボタンを表示
        backBtn.style.display = 'block';
    }

    // 「ゲームに戻る」ボタンの処理
    backBtn.addEventListener('click', () => {
        if (backBtn.dataset.returnUrl) {
            window.location.href = backBtn.dataset.returnUrl;
        }
    });
});