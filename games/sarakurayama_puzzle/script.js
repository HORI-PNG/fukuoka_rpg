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
                element: slot // スロット要素自体
            });
        });
    }

    // ピースをシャッフルして配置
    function initializePieces() {
        let pieceIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        pieceIndexes.sort(() => Math.random() - 0.5);
        
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

            // ★PCのマウスとスマホのタッチ両対応の「pointerdown」イベントに変更
            piece.addEventListener('pointerdown', onDragStart);
            
            pieceContainer.appendChild(piece);
        });
    }

    // --- Pointerイベント処理 (ドラッグ＆ドロップの代わり) ---

    // ピースを掴んだ時 (マウスダウンまたはタッチスタート)
    function onDragStart(e) {
        if (e.target.classList.contains('snapped')) return; // 配置済みは動かさない

        e.preventDefault();
        draggingPiece = e.target;
        draggingPiece.classList.add('dragging');
        draggingPiece.setPointerCapture(e.pointerId); // 指（ポインタ）をこの要素に固定

        const pieceRect = draggingPiece.getBoundingClientRect();
        
        // ピースの左上端から、指の位置までのズレを計算
        offsetX = e.clientX - pieceRect.left;
        offsetY = e.clientY - pieceRect.top;
        
        // ピースを body 直下に移動させ、座標の基準をページ全体にする
        document.body.appendChild(draggingPiece);

        // ピースを指の位置（ページの絶対座標）に合わせる
        draggingPiece.style.left = `${e.pageX - offsetX}px`;
        draggingPiece.style.top = `${e.pageY - offsetY}px`;

        // move と up (leave) イベントは document 全体で監視する
        document.addEventListener('pointermove', onDragMove);
        document.addEventListener('pointerup', onDragEnd);
        document.addEventListener('pointercancel', onDragEnd); // 予期せぬ終了
    }

    // ピースを動かしている時 (マウスムーブまたはタッチムーブ)
    function onDragMove(e) {
        if (!draggingPiece) return;
        e.preventDefault();

        // ピースを指（マウス）に追従させる
        draggingPiece.style.left = `${e.pageX - offsetX}px`;
        draggingPiece.style.top = `${e.pageY - offsetY}px`;
    }

    // ピースを離した時 (マウスアップまたはタッチエンド)
    function onDragEnd(e) {
        if (!draggingPiece) return;
        e.preventDefault();

        draggingPiece.classList.remove('dragging');
        draggingPiece.releasePointerCapture(e.pointerId); // ポインタ固定を解除

        // イベントリスナーを解除
        document.removeEventListener('pointermove', onDragMove);
        document.removeEventListener('pointerup', onDragEnd);
        document.removeEventListener('pointercancel', onDragEnd);

        // --- 当たり判定 ---
        const pieceRect = draggingPiece.getBoundingClientRect();
        // ピースの中心座標（ページの絶対座標）
        const pieceCenterX = pieceRect.left + window.scrollX + (pieceRect.width / 2);
        const pieceCenterY = pieceRect.top + window.scrollY + (pieceRect.height / 2);

        let snapped = false;
        calculateSlotPositions(); // 念のためスロット座標を再計算

        for (const slot of slotPositions) {
            // ピースの中心がスロットの範囲内にあるか
            if (
                pieceCenterX > slot.left && pieceCenterX < slot.right &&
                pieceCenterY > slot.top && pieceCenterY < slot.bottom
            ) {
                // スロットにハマった！
                // インデックス（data-index）が一致するか？
                if (slot.index === draggingPiece.dataset.index) {
                    // 正解！
                    slot.element.appendChild(draggingPiece); // スロット（div）にピース（div）を入れる
                    draggingPiece.style.left = '0'; // スロット内の(0,0)に配置
                    draggingPiece.style.top = '0';
                    draggingPiece.classList.add('snapped');
                    
                    correctPieces++;
                    snapped = true;
                    
                    if (correctPieces === TOTAL_PIECES) {
                        showResult();
                    }
                }
                break; // スロット判定終了
            }
        }
        
        if (!snapped) {
            // スナップしなかった場合、ピース置き場に戻す
            pieceContainer.appendChild(draggingPiece);
            // ピース置き場の中での座標（簡易的に左上に戻す）
            draggingPiece.style.left = '10px';
            draggingPiece.style.top = '10px';
        }

        draggingPiece = null;
    }
    
    function showResult() {
        resultArea.style.display = 'block';
    }

    backButton.addEventListener('click', () => {
        window.location.href = '../../index.html?reward=100億ドルの夜景&success=true';
    });
    
    // --- ゲーム開始 ---
    calculateSlotPositions(); // 最初にスロット座標を計算
    initializePieces(); // ピースを配置

    // スクロールやリサイズ時にスロット座標を再計算
    window.addEventListener('resize', calculateSlotPositions);
    window.addEventListener('scroll', calculateSlotPositions);
});