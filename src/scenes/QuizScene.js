import { quizzes } from '../data/quizzes.js';

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
        if (selectedChoice === correctAnswer) {
            // 正解の場合、GameSceneのaddItemを呼び出す
            gameScene.addItem(this.reward);
        } else {
            alert('残念、不正解です...');
        }
        
        // GameSceneを再開し、このクイズシーンは終了する
        this.scene.resume('GameScene');
        this.scene.stop();
    }
}