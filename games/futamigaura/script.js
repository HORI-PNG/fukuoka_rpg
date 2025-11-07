document.addEventListener('DOMContentLoaded', () => {
    const pieceContainer = document.getElementById('piece-container');
    const puzzleBoard = document.getElementById('puzzle-board');
    const slots = document.querySelectorAll('.puzzle-slot');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const TOTAL_PIECES = 9;
    let correctPieces = 0;

    let selectedPiece = null; // ★変更： 現在選択中のピース

    // スロットの座標計算は不要になりました
    
    // ピースをシャッフルして配置
    function initializePieces() {
        let pieceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        pieceIndexes.sort(() => Math.random() - 0.5);
        
        pieceIndexes.forEach((index, i) => {
            const piece = document.createElement('div');
            piece.className = `puzzle-piece piece-${index}`;
            piece.dataset.index = index;
            
            // ピース置き場の中での初期位置
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = (col * 155) + 10; // 150(幅) + 5(隙間)
            const y = (row * 95) + 10;  // 90(高さ) + 5(隙間)
            
            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;

            // ★修正： ピースのクリック（タップ）処理
            piece.addEventListener('pointerdown', (e) => {
                e.preventDefault(); // スクロールやダブルタップズームを防ぐ
                
                // 既に選択中のピースがあり、それが自分自身なら選択解除
                if (selectedPiece === piece) {
                    selectedPiece.classList.remove('dragging'); // 'dragging' スタイルを選択中として流用
                    selectedPiece = null;
                } 
                // 選択中のピースがなく、まだスナップされていないピースなら選択
                else if (!selectedPiece && !piece.classList.contains('snapped')) {
                    // もし他のピースが選択されていたら、それを解除
                    if (selectedPiece) {
                        selectedPiece.classList.remove('dragging');
                    }
                    selectedPiece = piece;
                    selectedPiece.classList.add('dragging'); // 選択中スタイル
                }
            });
            
            pieceContainer.appendChild(piece);
        });
    }

    // --- スロットのクリック（タップ）処理 ---
    slots.forEach(slot => {
        slot.addEventListener('pointerdown', (e) => {
            e.preventDefault(); // スクロールやダブルタップズームを防ぐ
            
            // ピースが選択されていないか、スロットが既に埋まっている場合は何もしない
            if (!selectedPiece || slot.hasChildNodes()) {
                // 選択中のピースがある場合、スロットをタップしたら選択解除
                if(selectedPiece) {
                    selectedPiece.classList.remove('dragging');
                    selectedPiece = null;
                }
                return;
            }

            const slotIndex = slot.dataset.index;
            const pieceIndex = selectedPiece.dataset.index;

            // 正しい場所にドロップされたか判定
            if (pieceIndex === slotIndex) {
                // 正解
                slot.appendChild(selectedPiece); // スロットにピースを入れる
                selectedPiece.classList.remove('dragging');
                selectedPiece.classList.add('snapped'); // スナップ済みクラスを追加
                selectedPiece.style.left = '0'; // スロット内の(0,0)に配置
                selectedPiece.style.top = '0';
                
                correctPieces++;
                selectedPiece = null; // 選択解除
                
                if (correctPieces === TOTAL_PIECES) {
                    showResult();
                }
            } else {
                // 不正解
                alert('場所が違います！');
                selectedPiece.classList.remove('dragging');
                selectedPiece = null; // 選択解除
            }
        });
    });

    function showResult() {
        resultArea.style.display = 'block';
    }

    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=縁結びのお守り&success=true';
    });
    
    initializePieces(); // ピースを配置
});