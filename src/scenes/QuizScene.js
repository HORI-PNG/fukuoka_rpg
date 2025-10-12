import { quizzes } from '../data/quizzes.js';

/**
 * スコアを保存する
 * @param {string} playerName - スコアを保存するプレイヤー名
 * @param {number} points - 加算するポイント
 * @returns {number} - 更新後の合計スコア
 */

function saveScore(playerName, points) {
    // ローカルストレージから全スコアを取得
    const scores = JSON.parse(localStorage.getItem('gameScores')) || {};
    // 現在のプレイヤーのスコアにポイントを加算
    scores[playerName] = (scores[playerName] || 0) + points;
    // 全スコアを保存
    localStorage.setItem('gameScores', JSON.stringify(scores));
    // 更新後のスコアを返す
    return scores[playerName];
}

export class QuizScene extends Phaser.Scene {
    constructor() {
        super({ key: 'QuizScene' });
    }

    init(data) {
        this.spotName = data.spotName;
        this.reward = data.reward;
    }

    create() {
        const quiz = quizzes[this.spotName];

        // 半透明の背景
        this.add.rectangle(400, 300, 700, 500, 0x000000, 0.8).setStrokeStyle(4, 0xffffff);

        // 問題文
        this.add.text(400, 120, quiz.question, {
            fontSize: '28px', fill: '#fff', align: 'center', wordWrap: { width: 650 }
        }).setOrigin(0.5);

        // 選択肢ボタン
        quiz.choices.forEach((choice, index) => {
            const buttonY = 250 + (index * 70);
            const button = this.add.text(400, buttonY, choice, {
                fontSize: '24px', fill: '#fff', backgroundColor: '#333', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

            button.on('pointerdown', () => {
                this.checkAnswer(choice, quiz.correctAnswer);
            });
        });
    }

    checkAnswer(selectedChoice, correctAnswer) {
        const gameScene = this.scene.get('GameScene');
        const currentPlayer = sessionStorage.getItem('currentPlayer');
        let resultText = '';

        if (selectedChoice === correctAnswer) {
            // --- 正解の場合 ---
            resultText = '正解！ 🎉\n1ポイント獲得！';
            gameScene.addItem(this.reward); // アイテムを追加
        
            if (currentPlayer) {
                const newScore = saveScore(currentPlayer, 1); // ★スコアを+1して保存
                // HTMLのスコア表示を更新
                document.getElementById('current-score').textContent = newScore;
            }
        } else {
            // --- 不正解の場合 ---
            resultText = `残念、不正解...\n正解は「${correctAnswer}」でした。`;
            // スコアは+0なので何もしない
        }
    
        // 結果を表示
        this.add.text(400, 300, resultText, { fontSize: '32px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        // 2秒後にゲーム画面に戻る
        this.time.delayedCall(2000, () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}