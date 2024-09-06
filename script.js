document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('ticTacToeBoard');
    const resetBtn = document.getElementById('resetBtn');
    let board = Array(3).fill().map(() => Array(3).fill(null));
    let currentPlayer = 'X';

    function drawBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const square = document.createElement('div');
                square.className = 'square';
                square.textContent = board[i][j] || '';
                square.addEventListener('click', () => handleSquareClick(i, j));
                boardElement.appendChild(square);
            }
        }
    }

    function handleSquareClick(row, col) {
        if (board[row][col] || checkWinner()) return;
        board[row][col] = currentPlayer;
        if (!checkWinner() && !isBoardFull()) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                makeBestMove();
            }
        }
        drawBoard();
    }

    function makeBestMove() {
        const bestMove = minimax(board, 0, -Infinity, Infinity, true);
        board[bestMove.row][bestMove.col] = 'O';
        currentPlayer = 'X';
    }

    function minimax(board, depth, alpha, beta, isMaximizing) {
        const winner = checkWinner();
        if (winner === 'X') return { score: -10 + depth };
        if (winner === 'O') return { score: 10 - depth };
        if (isBoardFull()) return { score: 0 };

        if (isMaximizing) {
            let bestMove = { score: -Infinity };
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (!board[i][j]) {
                        board[i][j] = 'O';
                        const move = minimax(board, depth + 1, alpha, beta, false);
                        board[i][j] = null;
                        if (move.score > bestMove.score) {
                            bestMove = { row: i, col: j, score: move.score };
                        }
                        alpha = Math.max(alpha, move.score);
                        if (beta <= alpha) break;
                    }
                }
            }
            return bestMove;
        } else {
            let bestMove = { score: Infinity };
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (!board[i][j]) {
                        board[i][j] = 'X';
                        const move = minimax(board, depth + 1, alpha, beta, true);
                        board[i][j] = null;
                        if (move.score < bestMove.score) {
                            bestMove = { row: i, col: j, score: move.score };
                        }
                        beta = Math.min(beta, move.score);
                        if (beta <= alpha) break;
                    }
                }
            }
            return bestMove;
        }
    }

    function checkWinner() {
        const lines = [
            // Horizontal
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // Vertical
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // Diagonal
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
        for (const [a, b, c] of lines) {
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return board[a[0]][a[1]];
            }
        }
        return null;
    }

    function isBoardFull() {
        return board.flat().every(cell => cell);
    }

    resetBtn.addEventListener('click', () => {
        board = Array(3).fill().map(() => Array(3).fill(null));
        currentPlayer = 'X';
        drawBoard();
    });

    drawBoard();
});


