import * as socket from './clientSocket.js'; //submitGuess(letter); and setUsername(username);

function getBySelector(selector) {
  const els = document.querySelectorAll(selector);
  if (els.length) {
    return els[0];
  }
}

function setContent(el, content) {
  if (el) {
    el.innerHTML = content;
  }
}

export class clientDisplay {
  // This code alters the visuals/ui of the game.
  // Methods from this class are called from clientGame.js upon game-state changes.
  // The display does have access to the gameState data directly

  constructor(gameState) {
    this.endOfGameMessage = document.getElementById('end-of-game-message');
    this.gameMessage = getBySelector('*[data-game-message]'); // These indexes mean there's no flexibility for now, as we need to wrap
    this.secretWord = getBySelector('[data-secret-word-display]'); // Visible to user
    this.userGuesses = getBySelector('*[data-user-guesses]');
    this.onlinePlayers = getBySelector('*[data-online-players]');
    this.guessDisplay = getBySelector('*[data-guess-display]');
    this.usernameInput = getBySelector('*[data-username-input]');
    this.usernameSubmit = getBySelector('*[data-username-submit]');
    // this.playerList = document.querySelectorAll('*[data-player-list]')[0];
    var onlinePlayers = getBySelector('*[data-online-players]');
    this.bodyParts = ['Head', 'Torso', 'Right_Arm', 'Left_Arm', 'Right_leg', 'Left_Leg']; // Bodypart ID's, in order of reveal
    this.gameState = gameState;
    this.reset();
    this.loadGame();
  }

  incorrectGuess() {
    // display actions for an incorrect guess
    setContent(this.gameMessage, this.gameState.guesser + ' guessed incorrectly. There are ' + (6 - this.gameState.incorrect) + ' guesses left.')
    this.revealPart();
  }

  invalidGuess() {
    // display actions for an invalid guess
    setContent(this.gameMessage, 'That is not a valid character to guess, or has already been guessed!')
    this.revealPart();
  }

  correctGuess() {
    // display actions for a correct guess
    setContent(this.gameMessage, this.gameState.guesser + ' guessed correctly!');
    this.updateSecretWord();
  }

  newGame() {
    // display actions for a new game case
    document.getElementsByTagName('body')[0].classList.remove('full-screen-message');
    setContent(this.gameMessage, 'New game has started!');
  }

  victory() {
    // display actions for a victory game case
    document.getElementsByTagName('body')[0].classList.add('full-screen-message');
    setContent(this.endOfGameMessage, '<span style="color: green">' + this.gameState.guesser + ' guessed correctly to win the game! Victory!</span><div>The word was: ' + this.gameState.blankword + '</div>');
  }

  defeat() {
    // Display actions for a defeat case
    document.getElementsByTagName('body')[0].classList.add('full-screen-message');
    setContent(this.endOfGameMessage, '<span style="color: red">' + this.gameState.guesser + ' guessed wrong. Game Over!</span><div>The word was: ' + this.gameState.blankword + '</div>');
  }

  revealPart() {
    // Reveal a bodypart
    var currentPartID = this.bodyParts[this.gameState.incorrect - 1];
    var currentPartElem = document.getElementById(currentPartID);
    if (currentPartElem) {
      currentPartElem.style.opacity = '1';
    } // This function should live in clientDisplay
  }

  hidePart(partElement) {
    // Hide a bodypart
    partElement.style.opacity = '0';
  }

  loadGame(guessStage) {
    //Loads hangman model accordingly to game state when you load the page
    var incorrectGuesses = this.gameState.incorrect;
    if (incorrectGuesses === 0) return;
    for (var i = 0; i < incorrectGuesses; i++) {
      var currentPartID = this.bodyParts[i];
      var currentPartElem = document.getElementById(currentPartID);
      if (currentPartElem) {
        currentPartElem.style.opacity = '1';
      }
    }
  }

  reset() {
    // Everything needed to reset the game board fully
    for (let part of this.bodyParts) {
      let partElement = document.getElementById(part);
      if (partElement) {
        this.hidePart(partElement);
      }
    }
    this.guessDisplay.innerHTML = '';
    this.userGuesses.innerHTML = '';
    this.updateSecretWord();
  }

  updatePastGuesses() {
    // Display previously guessed letters
    let guessedLettersContent = '';
    this.gameState.guesses.sort().forEach(function (l) {
      guessedLettersContent += '<span class="guessed-letter">' + l.toUpperCase() + '</span>';
    });
    setContent(this.userGuesses, 'Guesses: ' + guessedLettersContent);
  }

  updatePlayers(playerNames) {
    // Accepts an array of players
    setContent(this.onlinePlayers, playerNames.count);
    // this.playerList.innerHTML = playerNames.players;
  }

  updateSecretWord() {
    //
    let secretWordContent = '';
    this.gameState.blankword.split(' ').forEach(function (l) {
      secretWordContent += '<span class="guess-letter">' + l.toUpperCase() + '</span>';
    });
    setContent(this.secretWord, secretWordContent);
  }

  showGuess(letter) {
    // Shows the current letter a user has selected
    setContent(this.guessDisplay, letter.toUpperCase());
  }
}
