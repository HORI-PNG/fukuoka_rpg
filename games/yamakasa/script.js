const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const comboDisplay = document.getElementById('combo');
const startMessage = document.getElementById('start-message');

// --- ゲーム設定 ---
const NOTE_SPEED = 7; // ノーツの速度（難易度UP）
const JUDGEMENT_LINE_X = 100; // 判定ラインのX座標
const NOTE_RADIUS = 20; // ノーツの大きさ
const TIMING_WINDOWS = { // 判定の厳しさ（難易度UP）
    perfect: 15,
    great: 30,
    good: 50,
};

// --- ゲームの状態管理 ---
let score = 0;
let combo = 0;
let maxCombo = 0;
let notes = [];
let gameStarted = false;
let startTime = 0;

// --- 譜面データ (ノーツが登場する時間 - ミリ秒) ---
// 難易度高め: 高速、複雑なリズム
const beatmap = [
    500, 800, 1100, 1400, 1600, 1800, 2000, 2300, 2450, 2600, 2900, 3000, 3100,
    3500, 3800, 4100, 4400, 4600, 4800, 5000, 5300, 5450, 5600, 5900, 6000, 6100,
    6500, 6650, 6800, 6950, 7100, 7250, 7400, 7700, 8000, 8100, 8200, 8300, 8400
];
let nextNoteIndex = 0;

// --- ゲームのメインループ ---
function gameLoop(currentTime) {
    if (!gameStarted) return;
    const elapsedTime = currentTime - startTime;
    
    // 譜面から新しいノーツを生成
    if (nextNoteIndex < beatmap.length && elapsedTime >= beatmap[nextNoteIndex]) {
        notes.push({ x: canvas.width, y: canvas.height / 2, hit: false });
        nextNoteIndex++;
    }

    // 描画処理
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawJudgmentLine();
    updateAndDrawNotes();
    
    // ゲーム終了判定
    if (notes.length > 0 && notes.every(n => n.hit || n.x < 0)) {
        endGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// --- 描画関連の関数 ---
function drawJudgmentLine() {
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(JUDGEMENT_LINE_X, 0);
    ctx.lineTo(JUDGEMENT_LINE_X, canvas.height);
    ctx.stroke();
}

function updateAndDrawNotes() {
    for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        if (note.hit) continue;

        note.x -= NOTE_SPEED;

        // 判定ラインを過ぎたら MISS
        if (note.x < JUDGEMENT_LINE_X - TIMING_WINDOWS.good) {
            note.hit = true; // 処理済みとしてマーク
            updateCombo('miss');
        }

        ctx.fillStyle = `rgba(236, 240, 241, ${note.x / canvas.width})`;
        ctx.beginPath();
        ctx.arc(note.x, note.y, NOTE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- 入力と判定の処理 ---
function handleInput(e) {
    if (e.code !== 'Space') return;
    if (!gameStarted) {
        startGame();
        return;
    }

    let judged = false;
    for (const note of notes) {
        if (note.hit) continue;

        const distance = Math.abs(note.x - JUDGEMENT_LINE_X);
        if (distance < TIMING_WINDOWS.good) {
            if (distance < TIMING_WINDOWS.perfect) {
                judge('perfect');
            } else if (distance < TIMING_WINDOWS.great) {
                judge('great');
            } else {
                judge('good');
            }
            note.hit = true;
            judged = true;
            break; 
        }
    }
    // ノーツがない場所でキーを押した場合
    if (!judged) {
       // お手つきペナルティを入れるならここに書く（例: updateCombo('miss')）
    }
}

function judge(timing) {
    switch(timing) {
        case 'perfect': score += 300; break;
        case 'great':   score += 200; break;
        case 'good':    score += 100; break;
    }
    updateCombo(timing);
    scoreDisplay.textContent = score;
}

function updateCombo(timing) {
    if (timing === 'miss') {
        combo = 0;
    } else {
        combo++;
    }
    if (combo > maxCombo) {
        maxCombo = combo;
    }
    comboDisplay.textContent = combo;
}


// --- ゲームの開始と終了 ---
function startGame() {
    gameStarted = true;
    startMessage.style.display = 'none';
    startTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameStarted = false;
    const resultArea = document.getElementById('result-area');
    const resultMessage = document.getElementById('result-message');
    const finalScore = document.getElementById('final-score');
    const actionButton = document.getElementById('action-button');

    finalScore.textContent = score;
    const success = score > 5000; // クリア条件

    if (success) {
        resultMessage.textContent = 'クリア！見事な追い山だった！';
        actionButton.textContent = 'マップに戻る';
        actionButton.onclick = () => {
            window.location.href = '../../index.html?reward=手ぬぐい';
        };
    } else {
        resultMessage.textContent = '失敗...もっと気合を入れろ！';
        actionButton.textContent = 'もう一度挑戦';
        actionButton.onclick = () => {
            window.location.reload();
        };
    }
    resultArea.style.display = 'block';
}

// --- イベントリスナー ---
window.addEventListener('keydown', handleInput);