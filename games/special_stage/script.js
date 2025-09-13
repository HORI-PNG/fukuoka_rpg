// HTML要素の取得
const charLeft = document.getElementById('char-left');
const charRight = document.getElementById('char-right');
const charName = document.getElementById('character-name');
const dialogueText = document.getElementById('dialogue-text');
const optionsBox = document.getElementById('options-box');
const dialogueBox = document.getElementById('dialogue-box');

// キャラクターデータ
const characters = {
    cpu1: { name: 'CPU-1', image: './images/CPU_1.png' },
    cpu2: { name: 'CPU-2', image: './images/CPU_2.png' }
};

let currentScene = 0;
let correctChoices = 0; // 最善の選択をした回数

// シナリオデータ
const scenario = [
    { char: 'cpu1', text: 'ｺﾉ前届ｲﾀ『純白の聖女ﾘﾘｱﾝﾇ』ﾉ1/7ｽｹｰﾙﾌｨｷﾞｭｱ、ﾏｼﾞで神がかｯﾃﾙﾝだｹﾄﾞwww ｹﾞｯﾄした同志おる？www' }, // 0
    { char: 'cpu2', text: 'ｵｯ、A氏ﾓ買ｯﾀﾉｶw ﾜｲも昨日『開封の儀』を執り行ｯﾀﾄｺだﾜw ｱﾉ梱包の丁寧さｶﾗして既ﾆ神w' }, // 1
    { char: 'cpu1', text: 'ｿﾚﾅwww ﾜｶﾘみが深いwww ｱﾉ髪の毛ﾉ造形ﾄｶ見てみろﾖwww 透明ﾊﾟｰﾂ越しに肌がうっすら見えるﾝだわwww ﾊｧ…無限に眺めてられる…w ﾜｲはもう3時間眺めてる…😇' }, // 2
    { // プレイヤーの選択肢
      char: 'player', text: 'キモイですね。',
      choices: [
          { text: '生理的にムリ（こっち選んだら正解）', nextScene: 4, isCorrect: true },
          { text: 'ホントはもっと「ﾃﾞｭﾌ ﾃﾞｭﾌ... ｼｭﾎﾟﾝ」とかしてほしかったんだけど（こっち選んだら間違い）', nextScene: 5, isCorrect: false }
      ]
    }, // 3
    { char: 'cpu1', text: '...........................' }, // 4 (正解ルート)
    { char: 'cpu2', text: 'そうですか..................' }, // 5 (不正解ルート)
    { char: 'cpu1', text: '田中和明 35歳 独身 ' }, // 6
    { // プレイヤーの選択肢
        char: 'player', text: 'キモイですね？',
        choices: [
            { text: 'キショイですね（こっち選んだら正解）', nextScene: 8, isCorrect: true },
            { text: 'これはGeminiに作ってもらった文章なので、あんまり内容は気にしないでください（こっち選んだら間違い）', nextScene: 9, isCorrect: false }
        ]
    }, // 7
    { char: 'cpu2', text: '........................' }, // 8 (正解ルート)
    { char: 'cpu1', text: '内容は福岡に関するクイズとかでいいんじゃないかと思ってます' }, // 9 (不正解ルート)
    { char: 'cpu1', text: '全部正解選んだらこのメッセ' }, // 10 (グッドエンド)
    { char: 'cpu2', text: '一回でも間違い選んだらこのメッセ' }, // 11 (バッドエンド)
];

function showScene() {
    // ★追加：シナリオの最後に到達したかチェック
    if (currentScene >= scenario.length) {
        // 全ての会話が終わったので、最終結果を表示
        if (correctChoices >= 2) { // 正解数が2以上ならグッドエンド
            currentScene = 10;
        } else { // それ以外はバッドエンド
            currentScene = 11;
        }
    }

    const scene = scenario[currentScene];
    optionsBox.innerHTML = ''; // 選択肢をクリア

    if (scene.char === 'player') {
        // プレイヤーの選択肢を表示（この部分は変更なし）
        dialogueBox.style.cursor = 'default';
        dialogueText.textContent = scene.text;
        charName.textContent = 'あなた';
        
        scene.choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.textContent = choice.text;
            button.onclick = () => {
                if(choice.isCorrect) correctChoices++;
                currentScene = choice.nextScene;
                showScene();
            };
            optionsBox.appendChild(button);
        });

    } else {
        // 通常の会話
        dialogueBox.style.cursor = 'pointer';
        const character = characters[scene.char];
        charName.textContent = character.name;
        dialogueText.textContent = scene.text;
        
        if (scene.char === 'cpu1') {
            charLeft.src = character.image;
            charLeft.classList.add('active');
            charRight.classList.remove('active');
        } else {
            charRight.src = character.image;
            charRight.classList.add('active');
            charLeft.classList.remove('active');
        }

        // ★★★ エンディング処理をシンプルに変更 ★★★
        if (currentScene === 10) { // グッドエンド
            dialogueText.textContent += ' [クリア！マップに戻る]';
            dialogueBox.onclick = () => { window.location.href = '../../index.html'; };
        } else if (currentScene === 11) { // バッドエンド
            dialogueText.textContent += ' [もう一度挑戦する]';
            dialogueBox.onclick = () => { window.location.reload(); };
        } else {
            // ダイアログボックスをクリックで次のシーンへ進む
            dialogueBox.onclick = () => {
                currentScene++;
                showScene();
            };
        }
    }
}

// 最初のシーンを表示してゲーム開始
showScene();