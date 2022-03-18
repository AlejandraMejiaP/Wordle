'use strict'

/* Const and vars */

let input = document.querySelector('.input');
const SUBMIT_BUTTON = document.querySelector('.js-button');
const GAME_OVER = document.querySelector('.gameOver');
let secretWordDisplayed = document.querySelector('.gameOver_text');
const MESSAGE_ERROR = document.querySelector('.exist');
const REPLAY = document.querySelector('.reset');
const CONGRATS = document.querySelector(".congrats");
const FIRST_ROW = document.querySelectorAll('.firstRow__letter');
const SECOND_ROW = document.querySelectorAll('.secondRow__letter');
const THIRD_ROW = document.querySelectorAll('.thirdRow__letter');
const FOURT_ROW = document.querySelectorAll('.fourthRow__letter');
const FIFTH_ROW = document.querySelectorAll('.fifthRow__letter');
const SIXT_ROW = document.querySelectorAll('.sixthRow__letter');

let secretWord;

const GRID_SIZE = 6;
let roundCounter = 0;
const MAX_LENGTH_WORD = 5; 
const MATRIX_GRID = [
  FIRST_ROW,
  SECOND_ROW,
  THIRD_ROW,
  FOURT_ROW,
  FIFTH_ROW,
  SIXT_ROW,
];
let greyChar = [];
let greenChar = [];
let yellowChar = [];
let restChar = [];

getRandomWordFromApi ();

function getRandomWordFromApi () {
  fetch(`https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=${MAX_LENGTH_WORD}`)
  .then((response) => response.json())
  .then((responseApi) => { 
    secretWord = responseApi.body.Word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
   
  });
}

function comprobateUserWord () {
  let inputValue = input.value;
  let exists; 
  let userWord = inputValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();  
  fetch(`//palabras-aleatorias-public-api.herokuapp.com/palabras-aleatorias?Word=${inputValue.toLocaleLowerCase()}`)
  .then((response) => response.json())
  .then((data) => { 
    exists = (data.body.length > 0);
    if(exists) setTimeout(compareWords(userWord, exists));
    else MESSAGE_ERROR.classList.remove('hidden'); 
  });
} 

function compareWords(userWord) {
  // compare secret word and user word 
  MESSAGE_ERROR.classList.add('hidden');  
  let secretWordArray = secretWord.split('');
  let userWordArray = userWord.split('');  
  greenChar = [];
  yellowChar = [];
  greyChar = [];

  handleGreenChars(userWordArray, secretWordArray);
  handleYellowChars(userWordArray); 
  displayRow (userWordArray);
  checkIfWin ();

  roundCounter++;        
  input.value = '';
  abilitateButton();
}

function handleGreenChars (userWordArray, secretWordArray) {
  let greenCharCounter = 0;
  for (let i = 0; i < userWordArray.length; i++) {
    if (userWordArray[i] === secretWordArray[i]) {
      greenChar[greenCharCounter] = i
      greenCharCounter++;
      restChar[i] = "";
      } else {
        restChar[i] = secretWordArray[i];
    }
  }  
}

function handleYellowChars(userWordArray) {
  let indexyellowChar;
  let yellowCharCounter = 0;
  let greyCharCounter = 0;
  for (let j = 0; j < userWordArray.length; j++) {
    if (greenChar.indexOf(j) < 0) {
      if ( (indexyellowChar = restChar.indexOf(userWordArray[j])) >= 0) {
        yellowChar[yellowCharCounter] = j;
        yellowCharCounter++;
        restChar[indexyellowChar] = "";
      } else {        
        greyChar[greyCharCounter] = userWordArray[j];
        greyCharCounter++;
      }
    }    
  }
}

function displayRow (userWordArray) { 
  for(let i = 0; i < yellowChar.length; i++){
  }
  for(let i = 0; i < greyChar.length; i++){
   }
  //FIN TEMPORAL
  if (roundCounter <= (GRID_SIZE-1)) {
    let fill
    for (let k = 0; k < userWordArray.length;k++) {
      fill = MATRIX_GRID[roundCounter][k]
      fill.textContent = userWordArray[k]
      if (greenChar.indexOf(k) >=0 ) {
        MATRIX_GRID[roundCounter][k].parentNode.classList.add('correct')
      } else if (yellowChar.indexOf(k) >=0 ){
      MATRIX_GRID[roundCounter][k].parentNode.classList.add('almost')
      }
      else {
        MATRIX_GRID[roundCounter][k].parentNode.classList.add('incorrect')
      }
    }
    if (roundCounter >= (GRID_SIZE-1)) {    
      secretWordDisplayed.innerHTML += secretWord;
      secretWordDisplayed.classList.remove('hidden');
      GAME_OVER.classList.remove('hidden');
      SUBMIT_BUTTON.setAttribute('disabled', true);
      REPLAY.classList.remove('hidden');
    }
  }   
}

function checkIfWin () {
  if (greenChar.length === secretWord.length){
    CONGRATS.classList.toggle('hidden');
    REPLAY.classList.remove('hidden');
    SUBMIT_BUTTON.classList.add('hidden');
    input.classList.add('hidden');}    
}  

function abilitateButton() {
  if (input.value.length === MAX_LENGTH_WORD) {
    SUBMIT_BUTTON.removeAttribute('disabled')
  } else if (input.value.length < MAX_LENGTH_WORD) {
    SUBMIT_BUTTON.setAttribute('disabled', true)
  }
}

function resetGame () {
  location.reload();  
}

// modal window 
if(document.getElementById("btnModal")){
  
  const MODAL = document.getElementById("myModal");
  const MODAL_BTN = document.getElementById("btnModal");
  const SPAN = document.getElementsByClassName("close")[0];
  const BODY = document.getElementsByTagName("body")[0];

  MODAL_BTN.onclick = function() {
    MODAL.style.display = "block";
    BODY.style.position = "static";
    BODY.style.height = "100%";
    BODY.style.overflow = "hidden";
  }

  SPAN.onclick = function() {
    MODAL.style.display = "none";
    BODY.style.position = "inherit";
    BODY.style.height = "auto";
    BODY.style.overflow = "visible";
  }

  window.onclick = function(event) {
    if (event.target == MODAL) {
      MODAL.style.display = "none";
      BODY.style.position = "inherit";
      BODY.style.height = "auto";
      BODY.style.overflow = "visible";
    }
  }
}

/*EVENTS */
SUBMIT_BUTTON.addEventListener('click', comprobateUserWord);
input.addEventListener('keyup', (event)=> {
  if(event.keyCode === 13) {
    SUBMIT_BUTTON.click();
  }
});
input.addEventListener('keyup', abilitateButton);
REPLAY.addEventListener('click', resetGame);

