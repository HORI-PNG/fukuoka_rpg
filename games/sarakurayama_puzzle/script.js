document.addEventListener('DOMContentLoaded', () => {
    const pieceContainer = document.getElementById('piece-container');
    const puzzleBoard = document.getElementById('puzzle-board');
    const slots = document.querySelectorAll('.puzzle-slot');
    const resultArea = document.querySelector('.result-area');
    const backButton = document.getElementById('back-to-map');

    const TOTAL_PIECES = 9;
    let correctPieces = 0;

    let draggingPiece = null; // 現在操作中のピース
    let offsetX = 0; // ピースの左上とタッチ位置のズレ(X)
    let offsetY = 0; // ピースの左上とタッチ位置のズレ(Y)
    
    // スロットの絶対座標を保持
    let slotPositions = [];

    // ★追加：ピースの「元の位置」を保存する
    const pieceOriginalPositions = new Map();

    // スロットの絶対座標（ページ全体）を計算・再計算する関数
    function calculateSlotPositions() {
        slotPositions = [];
        slots.forEach(slot => {
            const rect = slot.getBoundingClientRect();
            slotPositions.push({
                index: slot.dataset.index,
                left: rect.left + window.scrollX,
                top: rect.top + window.scrollY,
                right: rect.right + window.scrollX,
                bottom: rect.bottom + window.scrollY,
                element: slot
            });
        });
    }

    // ピースをシャッフルして配置
    function initializePieces() {
        let pieceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        pieceIndexes.sort(() => Math.random() - 0.5);
        
        const containerRect = pieceContainer.getBoundingClientRect();
        
        pieceIndexes.forEach((index, i) => {
            const piece = document.createElement('div');
            piece.className = `puzzle-piece piece-${index}`;
            piece.dataset.index = index;
            
            // ピース置き場の中で重ならないように配置（簡易的）
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = (col * 155) + 10; // 150(幅) + 5(隙間)
            const y = (row * 95) + 10;  // 90(高さ) + 5(隙間)
            
            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;

            // ★追加：元の相対座標を保存
            pieceOriginalPositions.set(piece, { x: x, y: y });

            piece.addEventListener('pointerdown', onDragStart);
            pieceContainer.appendChild(piece);
        });
    }

    // --- Pointerイベント処理 ---

    // ピースを掴んだ時
    function onDragStart(e) {
        if (e.target.classList.contains('snapped')) return;

        e.preventDefault();
        draggingPiece = e.target;
        draggingPiece.classList.add('dragging');
        draggingPiece.setPointerCapture(e.pointerId); 

        const pieceRect = draggingPiece.getBoundingClientRect();
        const containerRect = pieceContainer.getBoundingClientRect();
        
        // ★修正：ピースの「ページ絶対座標」を計算
        // (コンテナのページ座標 + ピースのコンテナ内座標)
        const pieceAbsX = (containerRect.left + window.scrollX) + draggingPiece.offsetLeft;
        const pieceAbsY = (containerRect.top + window.scrollY) + draggingPiece.offsetTop;

        // ★修正：指の「ページ絶対座標」とのズレを計算
        offsetX = e.pageX - pieceAbsX;
        offsetY = e.pageY - pieceAbsY;
        
        // ピースを body 直下に移動させ、座標の基準をページ全体にする
        document.body.appendChild(draggingPiece);

        // ★修正：計算した絶対座標で再配置
        draggingPiece.style.left = `${pieceAbsX}px`;
        draggingPiece.style.top = `${pieceAbsY}px`;

        document.addEventListener('pointermove', onDragMove);
        document.addEventListener('pointerup', onDragEnd);
        document.addEventListener('pointercancel', onDragEnd);
    }

    // ピースを動かしている時
    function onDragMove(e) {
        if (!draggingPiece) return;
        e.preventDefault();

        // ピースを指（マウス）に追従させる（ページ絶対座標）
        draggingPiece.style.left = `${e.pageX - offsetX}px`;
        draggingPiece.style.top = `${e.pageY - offsetY}px`;
    }

    // ピースを離した時
    function onDragEnd(e) {
        if (!draggingPiece) return;
        e.preventDefault();

        draggingPiece.classList.remove('dragging');
        draggingPiece.releasePointerCapture(e.pointerId); 

        document.removeEventListener('pointermove', onDragMove);
        document.removeEventListener('pointerup', onDragEnd);
        document.removeEventListener('pointercancel', onDragEnd);

        const pieceRect = draggingPiece.getBoundingClientRect();
        const pieceCenterX = pieceRect.left + window.scrollX + (pieceRect.width / 2);
        const pieceCenterY = pieceRect.top + window.scrollY + (pieceRect.height / 2);

        let snapped = false;
        calculateSlotPositions();

        for (const slot of slotPositions) {
            if (
                pieceCenterX > slot.left && pieceCenterX < slot.right &&
                pieceCenterY > slot.top && pieceCenterY < slot.bottom
            ) {
                if (slot.index === draggingPiece.dataset.index) {
                    // 正解！
                    slot.element.appendChild(draggingPiece); 
                    draggingPiece.style.left = '0';
                    draggingPiece.style.top = '0';
                    draggingPiece.classList.add('snapped');
                    
                    correctPieces++;
                    snapped = true;
                    
                    if (correctPieces === TOTAL_PIECES) {
                        showResult();
                    }
                }
                break; 
            }
        }
        
        if (!snapped) {
            // ★修正：スナップしなかった場合、ピース置き場に「元の位置」に戻す
            pieceContainer.appendChild(draggingPiece);
            const originalPos = pieceOriginalPositions.get(draggingPiece);
            if (originalPos) {
                draggingPiece.style.left = `${originalPos.x}px`;
                draggingPiece.style.top = `${originalPos.y}px`;
            } else {
                // 念のためフォールバック
                draggingPiece.style.left = '10px';
                draggingPiece.style.top = '10px';
            }
        }

        draggingPiece = null;
    }
    
    function showResult() {
        resultArea.style.display = 'block';
    }

    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=100億ドルの夜景&success=true';
    });
    
    calculateSlotPositions(); 
    initializePieces(); 

    window.addEventListener('resize', calculateSlotPositions);
    window.addEventListener('scroll', calculateSlotPositions);
});