// ==========================================
// POKER MEMORY GAME - Main JavaScript Logic
// ==========================================

// ---------- POKER CARD DATA ----------
const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS = ['A', 'K', 'Q', 'J'];

/**
 * Get suit symbol character
 * @param {string} suit - The suit name
 * @returns {string} Unicode symbol
 */
const getSuitSymbol = (suit) => {
  const symbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
  return symbols[suit] || '?';
};

/**
 * Generate all card objects using ES6 array functions
 * Uses flatMap (ES6) to create array of card objects
 * @returns {Array} Array of card objects
 */
const generateCardDeck = () => {
  return SUITS.flatMap(suit => 
    RANKS.map(rank => ({
      id: `${rank}-${suit}`,
      rank,
      suit,
      symbol: getSuitSymbol(suit),
      color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
    }))
  );
};

// ---------- GAME STATE ----------
let cards = [];
let flippedIndices = [];
let matchedPairIds = new Set();
let lockBoard = false;
let timeoutHandle = null;
let pairsMatchedCount = 0;

const TOTAL_PAIRS = 8;

// DOM Elements
const gridEl = document.getElementById('game-grid');
const pairsMatchedSpan = document.getElementById('pairs-matched');
const totalPairsSpan = document.getElementById('total-pairs');
const statusBadge = document.getElementById('status-badge');
const messageBox = document.getElementById('message-box');

// Initialize total pairs display
totalPairsSpan.textContent = TOTAL_PAIRS;

// ---------- RECURSION DEMONSTRATION ----------
/**
 * Recursively reset flipped cards back to face-down with delay
 * @param {Array} indicesToReset - Array of card indices to flip back
 * @param {number} delayStep - Internal parameter for recursion timing
 */
const recursiveCountdownReset = (indicesToReset, delayStep = 0) => {
  // Base case: no more indices to process
  if (!indicesToReset || indicesToReset.length === 0) {
    lockBoard = false;
    flippedIndices = [];
    updateUIState();
    return;
  }
  
  // Process first index, recurse with rest
  const [firstIndex, ...restIndices] = indicesToReset;
  
  const cardElement = document.querySelector(`.card[data-index='${firstIndex}']`);
  if (cardElement) {
    cardElement.classList.remove('flipped');
  }
  
  setTimeout(() => {
    recursiveCountdownReset(restIndices, delayStep);
  }, 120);
};

/**
 * Recursively build array from Set iterator
 * @param {Set} matchedSet - Set of matched card IDs
 * @param {Iterator} iterator - Set iterator
 * @param {Array} acc - Accumulator array
 * @returns {Array} Array of matched IDs
 */
const buildMatchedListRecursive = (matchedSet, iterator = matchedSet.values(), acc = []) => {
  const next = iterator.next();
  if (next.done) return acc;
  acc.push(next.value);
  return buildMatchedListRecursive(matchedSet, iterator, acc);
};

// ---------- EXCEPTION HANDLING ----------
/**
 * Validate card index bounds
 * @param {number} index - Card index to validate
 * @throws {Error} If index is invalid
 * @returns {boolean} True if valid
 */
const validateCardIndex = (index) => {
  if (typeof index !== 'number' || index < 0 || index >= cards.length) {
    throw new Error(`Invalid card index: ${index}. Must be between 0 and ${cards.length - 1}`);
  }
  return true;
};

// ---------- UTILITY FUNCTIONS ----------
/**
 * Fisher-Yates shuffle using ES6 spread
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ---------- GAME CORE ----------
/**
 * Initialize or reset the game
 */
const initializeGame = () => {
  // Clear any pending timeouts
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
    timeoutHandle = null;
  }
  
  // Generate base cards and duplicate for pairs
  const baseCards = generateCardDeck();
  const deckPairs = baseCards.flatMap(card => [card, { ...card }]);
  
  // Shuffle and reset state
  cards = shuffleArray(deckPairs);
  flippedIndices = [];
  matchedPairIds.clear();
  lockBoard = false;
  pairsMatchedCount = 0;
  
  updateStatsDisplay();
  renderBoard();
  setMessage('🃏 Find all pairs!');
  statusBadge.textContent = '▶ PLAY';
  
  // Exception handling demonstration
  try {
    validateCardIndex(0); // Valid call
    // Uncomment below to test exception:
    // validateCardIndex(100);
  } catch (error) {
    console.warn('Exception caught (demo):', error.message);
    setMessage('⚠️ Handled error: ' + error.message);
  }
};

/**
 * Render the game board using ES6 map
 */
const renderBoard = () => {
  if (!gridEl) return;
  
  const htmlString = cards.map((card, index) => {
    const isFlipped = flippedIndices.includes(index) || matchedPairIds.has(card.id);
    const suitClass = card.color === 'red' ? 'red-suit' : 'black-suit';
    
    return `
      <div class="card ${isFlipped ? 'flipped' : ''}" data-index="${index}" data-card-id="${card.id}">
        <div class="card-inner">
          <div class="card-front">
            <span class="${suitClass}">${card.rank}</span>
            <span class="${suitClass}" style="font-size:1.6rem;">${card.symbol}</span>
          </div>
          <div class="card-back"></div>
        </div>
      </div>
    `;
  }).join('');
  
  gridEl.innerHTML = htmlString;
  
  // Attach event listeners
  document.querySelectorAll('.card').forEach(cardEl => {
    cardEl.addEventListener('click', cardClickHandler);
  });
};

/**
 * Handle card click events
 * @param {Event} event - Click event
 */
const cardClickHandler = (event) => {
  const cardElement = event.currentTarget;
  const index = parseInt(cardElement.getAttribute('data-index'), 10);
  
  // Exception handling for index validation
  try {
    validateCardIndex(index);
  } catch (err) {
    setMessage('❌ ' + err.message);
    return;
  }
  
  if (lockBoard) {
    setMessage('⏳ Wait for cards to turn back...');
    return;
  }
  
  const cardData = cards[index];
  
  // Check if already matched or flipped
  if (matchedPairIds.has(cardData.id)) return;
  if (flippedIndices.includes(index)) return;
  
  flipCardOpen(index);
};

/**
 * Flip a card face up
 * @param {number} index - Card index to flip
 */
const flipCardOpen = (index) => {
  flippedIndices = [...flippedIndices, index];
  
  const cardEl = document.querySelector(`.card[data-index='${index}']`);
  if (cardEl) cardEl.classList.add('flipped');
  
  // Anime.js library animation
  if (cardEl && typeof anime !== 'undefined') {
    anime({
      targets: cardEl,
      scale: [0.9, 1],
      duration: 250,
      easing: 'easeOutElastic(1, .6)',
    });
  }
  
  if (flippedIndices.length === 2) {
    checkMatch();
  } else {
    updateUIState();
  }
};

/**
 * Check if two flipped cards match
 */
const checkMatch = () => {
  const [idx1, idx2] = flippedIndices;
  const card1 = cards[idx1];
  const card2 = cards[idx2];
  
  if (card1.id === card2.id) {
    handleMatch(idx1, idx2, card1.id);
  } else {
    handleMismatch();
  }
};

/**
 * Process a successful match
 */
const handleMatch = (idx1, idx2, cardId) => {
  matchedPairIds.add(cardId);
  pairsMatchedCount = matchedPairIds.size;
  flippedIndices = [];
  
  // Anime.js match celebration
  const cardEl1 = document.querySelector(`.card[data-index='${idx1}']`);
  const cardEl2 = document.querySelector(`.card[data-index='${idx2}']`);
  
  if (typeof anime !== 'undefined') {
    anime({
      targets: [cardEl1, cardEl2],
      boxShadow: ['0 0 0px gold', '0 0 25px gold', '0 0 8px gold'],
      scale: [1, 1.08, 1],
      duration: 700,
      easing: 'easeInOutQuad',
    });
  }
  
  updateStatsDisplay();
  setMessage('✅ Match found!');
  statusBadge.textContent = '✨ MATCH!';
  
  checkWinCondition();
  lockBoard = false;
  updateUIState();
};

/**
 * Process mismatched cards
 */
const handleMismatch = () => {
  lockBoard = true;
  setMessage('❌ Not a match...');
  statusBadge.textContent = '⏳';
  
  const indicesToReset = [...flippedIndices];
  
  timeoutHandle = setTimeout(() => {
    recursiveCountdownReset(indicesToReset);
    setMessage('🔄 Try again');
    statusBadge.textContent = '▶';
    timeoutHandle = null;
  }, 850);
  
  updateUIState();
};

/**
 * Check if all pairs have been matched (win condition)
 * Uses ES6 every() method
 */
const checkWinCondition = () => {
  const allMatched = cards.every(card => matchedPairIds.has(card.id));
  
  if (allMatched) {
    setMessage('🎉 YOU WIN! Amazing memory!');
    statusBadge.textContent = '🏆 WINNER';
    
    // Recursive function demonstration
    const matchedList = buildMatchedListRecursive(matchedPairIds);
    console.log('Matched pairs (via recursion):', matchedList);
    
    // Anime.js win animation
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.card',
        rotate: ['0deg', '5deg', '-5deg', '0deg'],
        duration: 900,
        delay: anime.stagger(70),
        easing: 'easeInOutSine',
      });
    }
  }
};

/**
 * Update visual state of all cards
 */
const updateUIState = () => {
  document.querySelectorAll('.card').forEach(cardEl => {
    const index = parseInt(cardEl.getAttribute('data-index'), 10);
    const cardId = cards[index]?.id;
    
    if (matchedPairIds.has(cardId)) {
      cardEl.classList.add('flipped');
    } else if (!flippedIndices.includes(index)) {
      cardEl.classList.remove('flipped');
    }
  });
};

/**
 * Update the pairs counter display
 */
const updateStatsDisplay = () => {
  pairsMatchedSpan.textContent = pairsMatchedCount;
};

/**
 * Set message in the message box
 * @param {string} text - Message to display
 */
const setMessage = (text) => {
  if (messageBox) messageBox.textContent = text;
};

// ---------- EVENT LISTENERS ----------
document.getElementById('new-game-btn').addEventListener('click', () => {
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
    timeoutHandle = null;
  }
  lockBoard = false;
  initializeGame();
  
  // Anime.js button animation
  if (typeof anime !== 'undefined') {
    anime({
      targets: '#new-game-btn',
      scale: [1, 1.1, 1],
      duration: 400,
      easing: 'easeOutElastic(1.2)',
    });
  }
});

// ---------- START GAME ----------
initializeGame();

console.log('🃏 Poker Memory Game Ready');
console.log('ES6 Features: map, flatMap, filter, every, spread operator');
console.log('Recursion: recursiveCountdownReset, buildMatchedListRecursive');
console.log('External Library: Anime.js for animations');
console.log('Exception Handling: validateCardIndex with try/catch');