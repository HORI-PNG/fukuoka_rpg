import { quizzes } from '../data/quizzes.js';

/**
 * 現在のプレイヤーのスコアをFirebaseに保存する
 * @param {string} uid - 現在のプレイヤーのユニークID
 * @param {number} points - 加算するポイント
 * @returns {Promise<number>} - 更新後の合計スコア
 */
async function saveScore(uid, points) {
    const { db, doc, getDoc, setDoc } = window.firebaseTools;
    const playerDocRef = doc(db, 'players', uid);

    try {
        // まず現在のデータを取得
        const docSnap = await getDoc(playerDocRef);
        let currentScore = 0;
        if (docSnap.exists()) {
            currentScore = docSnap.data().score || 0;
        }

        // 新しいスコアを計算
        const newScore = currentScore + points;

        // 新しいスコアを、既存のデータと統合(merge)する形で保存
        await setDoc(playerDocRef, { score: newScore }, { merge: true });

        return newScore;

    } catch (error) {
        console.error("スコアの保存に失敗しました:", error);
        return 0; // エラーの場合は0を返す
    }
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
        const currentPlayerUID = sessionStorage.getItem('currentPlayerUID');
        let resultText = '';

        if (selectedChoice === correctAnswer) {
            resultText = '正解！ 🎉\n1ポイント獲得！';
            gameScene.addItem(this.reward);
        
            if (currentPlayerUID) {
                // ★非同期処理になったため await を使う
                const newScore = await saveScore(currentPlayerUID, 1);
                document.getElementById('current-score').textContent = newScore;
            }
        } else {
            resultText = `残念、不正解...\n正解は「${correctAnswer}」でした。`;
        }
    
        this.add.text(400, 300, resultText, { fontSize: '32px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}