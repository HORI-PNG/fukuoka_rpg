document.addEventListener('DOMContentLoaded', () => {
    const pieceContainer = document.getElementById('piece-container');
    const puzzleBoard = document.getElementById('puzzle-board');
    const slots = document.querySelectorAll('.puzzle-slot');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const TOTAL_PIECES = 9;
    let correctPieces = 0;

    // ピースのインデックス（0から8）
    let pieceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // ピースをシャッフルして配置
    pieceIndexes.sort(() => Math.random() - 0.5);
    
    pieceIndexes.forEach(index => {
        const piece = document.createElement('div');
        piece.className = `puzzle-piece piece-${index}`;
        piece.dataset.index = index;
        piece.draggable = true;
        
        // ドラッグ開始時の処理
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
            e.target.style.cursor = 'grabbing';
        });
        
        piece.addEventListener('dragend', (e) => {
            e.target.style.cursor = 'grab';
        });

        pieceContainer.appendChild(piece);
    });

    // スロット（ドロップ先）の処理
    slots.forEach(slot => {
        // ドラッグ中のピースがスロット上に来た時の処理
        slot.addEventListener('dragover', (e) => {
            e.preventDefault(); // ドロップを許可
            slot.style.backgroundColor = '#555';
        });

        // スロットから離れた時の処理
        slot.addEventListener('dragleave', () => {
            slot.style.backgroundColor = '#333';
        });

        // ドロップ時の処理
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.style.backgroundColor = '#333';
            
            const pieceIndex = e.dataTransfer.getData('text/plain');
            const slotIndex = slot.dataset.index;

            // 正しい場所にドロップされたか判定
            if (pieceIndex === slotIndex) {
                // 正解
                const piece = document.querySelector(`.puzzle-piece[data-index="${pieceIndex}"]`);
                slot.appendChild(piece); // スロットにピースを入れる
                piece.draggable = false; // もう動かせないようにする
                piece.style.cursor = 'default';
                slot.style.border = 'none'; // 枠線を消す
                
                correctPieces++;
                if (correctPieces === TOTAL_PIECES) {
                    showResult();
                }
            } else {
                // 不正解
                alert('場所が違います！');
            }
        });
    });

    function showResult() {
        resultArea.style.display = 'block';
    }

    // マップに戻るボタンの処理
    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=もつ鍋&success=true';
    });
});