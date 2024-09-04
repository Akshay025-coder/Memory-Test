const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...cardValues, ...cardValues];
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;
let score = 0; // Initialize score
let isChecking = false; // Flag to prevent clicks during checking/unflipping
let timer;
let timeRemaining = 120; // 2 minutes in seconds
let gameStarted = false; // Flag to track if the game has started

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    const board = document.getElementById('game-board');
    shuffle(cards);
    board.innerHTML = ''; // Clear any existing cards

    cards.forEach((value) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.textContent = value; // Show card value initially
        card.classList.add('flipped'); // Ensure cards are flipped initially
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    // Show cards for 5 seconds, then hide them and start the game
    setTimeout(() => {
        hideCards();
        if (gameStarted) {
            startTimer(); // Start the timer after hiding the cards
        }
    }, 5000);

    updateScore(); // Update score display on board creation

    // Add event listener to "Try Again" button
    document.getElementById('try-again').addEventListener('click', () => {
        resetGame();
    });
}

function flipCard(event) {
    const clickedCard = event.target;

    // Prevent clicking on already flipped, matched cards or if we are currently checking/unflipping
    if (isChecking || clickedCard.classList.contains('flipped') || clickedCard === firstCard) {
        return;
    }

    clickedCard.classList.add('flipped');
    clickedCard.textContent = clickedCard.dataset.value; // Show card value

    if (!firstCard) {
        // Set the first card
        firstCard = clickedCard;
    } else {
        // Set the second card and check for a match
        secondCard = clickedCard;
        checkForMatch();
    }
}

function checkForMatch() {
    isChecking = true; // Set flag to true to prevent further clicks

    if (firstCard.dataset.value === secondCard.dataset.value) {
        // Cards match
        matchedPairs++;
        score += 10; // Award points for a correct match
        resetCards();
        if (matchedPairs === cardValues.length) {
            document.getElementById('status').textContent = 'You found all pairs!';
            clearInterval(timer); // Stop the timer
            showGameOver(); // Show game over message and button
        }
        isChecking = false; // Allow clicks for new turns
    } else {
        // Cards do not match
        score = Math.max(score - 2, 0); // Deduct points for a mistake, ensuring score doesn't go below 0
        // Wait before unflipping to let users see the second card
        setTimeout(() => {
            unflipCards();
            isChecking = false; // Reset flag after unflipping
        }, 1000);
    }
    updateScore(); // Update score display
}

function resetCards() {
    firstCard = null;
    secondCard = null;
}

function unflipCards() {
    if (firstCard && secondCard) {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = ''; // Hide card value again
        secondCard.textContent = ''; // Hide card value again
    }
    resetCards();
}

function hideCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('flipped');
        card.textContent = ''; // Hide card values
    });
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            document.getElementById('status').textContent = 'Time\'s up! Game Over!';
            showGameOver(); // Show game over message and button
            return;
        }

        // Update the timer display
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        timeRemaining--;
    }, 1000);
}

function showGameOver() {
    document.getElementById('game-over').style.display = 'block';
}

function hideGameOver() {
    document.getElementById('game-over').style.display = 'none';
}

function resetGame() {
    // Hide the "Game Over" message and reset the game
    hideGameOver();
    matchedPairs = 0;
    score = 0;
    timeRemaining = 120; // Reset timer
    document.getElementById('status').textContent = '';
    updateScore();
    createBoard();
    gameStarted = false; // Reset game start flag
}

function updateScore() {
    // Update the score display
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Add event listener to "Start Game" button
document.getElementById('start-game').addEventListener('click', () => {
    gameStarted = true; // Set flag to indicate the game has started
    document.getElementById('start-game').style.display = 'none'; // Hide the start button
    createBoard();
});
