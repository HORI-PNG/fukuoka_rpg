import { quizzes } from '../data/quizzes.js';

/**
 * 現在のプレイヤーのスコアをFirebaseに保存する
 * @param {string} uid - 現在のプレイヤーのユニークID
 * @param {number} points - 加算するポイント
 * @returns {Promise<number>} - 更新後の合計スコア
 */

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
        this.add.rectangle(400, 300, 700, 500, 0x000000, 0.8).setStrokeStyle(4, 0xffffff);
        this.add.text(400, 120, quiz.question, {
            fontSize: '28px', fill: '#fff', align: 'center', wordWrap: { width: 650 }
        }).setOrigin(0.5);

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

    async checkAnswer(selectedChoice, correctAnswer) {
        const gameScene = this.scene.get('GameScene');
        let resultText = '';

        if (selectedChoice === correctAnswer) {
            resultText = '正解！ \n1ポイント獲得！';
            // GameSceneのaddItemを呼び出す
            gameScene.addItem(this.reward);
        
            // game.jsで用意したAPIを呼び出してスコアを更新
            if (window.gameApi && typeof window.gameApi.updateScore === 'function') {
                await window.gameApi.updateScore(1);
            }
        } else {
            resultText = `不正解...\n正解は「${correctAnswer}」でした。`;
        }
    
        this.add.text(400, 300, resultText, { fontSize: '32px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}