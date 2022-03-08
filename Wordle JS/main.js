'use strict'

/* Constante y variables */

let secretWord;
let input = document.querySelector('.input')
const submitButton = document.querySelector('.js-button')
let counter = 0
const grid = document.querySelector('.grid')
const gridColor = document.querySelectorAll('.grid__fill')
const gameOver = document.querySelector('.gameOver');
const secretWordDisplayed = document.querySelector('.gameOver_text')
const messageError = document.querySelector('.exist');
const congrats = document.querySelector(".congrats");
const firstRow = document.querySelectorAll('.firstRow__letter')
const secondRow = document.querySelectorAll('.secondRow__letter')
const thirdRow = document.querySelectorAll('.thirdRow__letter')
const fourthRow = document.querySelectorAll('.fourthRow__letter')
const fifthRow = document.querySelectorAll('.fifthRow__letter')
const sixthRow = document.querySelectorAll('.sixthRow__letter')
const GridSize = 6;
const maxlengthWord = 5; 
const matrixGrid = [
  firstRow,
  secondRow,
  thirdRow,
  fourthRow,
  fifthRow,
  sixthRow,
]
let wrongLetters = []
let rightLetters = []
let almostLetters = []
let restLetters = []


/* Get Word from API */ 

function getWordFromApi () {
  fetch(`https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=${maxlengthWord}`)
  .then((response) => response.json())
  .then((responseApi) => { 
    secretWord = responseApi.body.Word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  console.log(secretWord);
});
}
getWordFromApi ();
/* Comprobate if user word exist */
let exists; 
let inputValue = "";
function getUserWord () {
  inputValue = input.value
  }

function comprobateUserWord () {
  let userWord = inputValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();  
  fetch(`//palabras-aleatorias-public-api.herokuapp.com/palabras-aleatorias?Word=${inputValue.toLocaleLowerCase()}`)
  .then((response) => response.json())
  .then((data) => { 
    exists = (data.body.length !== 0);
    setTimeout(compareLetters(userWord),
    );  
});
} 



/* compare arrays */
function compareLetters(userWord) {       
if (exists) {  
  let secretWordArray = secretWord.split('');
  messageError.classList.add('hidden');
  let userWordArray = userWord.split('')
  rightLetters = []
  let rightLettersCounter = 0;
  almostLetters = [];
  let almostLettersCounter = 0;

  for (let i = 0; i < userWordArray.length; i++) {
    if (userWordArray[i] === secretWordArray[i]) {
      rightLetters[rightLettersCounter] = i
      rightLettersCounter++;
      restLetters[i] = "";
    } else {
        restLetters[i] = secretWordArray[i];
    }
  }

  let indexAlmostLetters;
  for (let j = 0; j < 5; j++) {
    if (rightLetters.indexOf(j) < 0) {
      if ( (indexAlmostLetters = restLetters.indexOf(userWordArray[j])) >= 0) {
        almostLetters[almostLettersCounter] = j;
        almostLettersCounter++;
        // restLetters[j] = ""        
      }
    }
    
   }
    /* show in grid the user word */
    if (counter <= 5) {
      let fill
      for (let k = 0; k < userWordArray.length;k++) {
        fill = matrixGrid[counter][k]
        fill.textContent = userWordArray[k]
        if (rightLetters.indexOf(k) !== -1) {
          matrixGrid[counter][k].parentNode.classList.add('correct')
        } else if (almostLetters.indexOf(k) !== -1){
        matrixGrid[counter][k].parentNode.classList.add('almost')
        }
      }
      if (counter >= 5) {    
        secretWordDisplayed.innerHTML += secretWord;
        secretWordDisplayed.classList.remove('hidden');
        gameOver.classList.remove('hidden');
        submitButton.setAttribute('disabled', true);
      }
    } 

    input.value = ''
    
    if (rightLetters.length === secretWord.length){
        congrats.classList.toggle('hidden');
        submitButton.classList.add('hidden');
        input.classList.add('hidden');
        
    }
    counter++;
  }
   else {    
      messageError.classList.remove('hidden');
    }    

  }

  

/* Abilitate button */
function abilitateButton() {
  if (input.value.length === 5) {
    submitButton.removeAttribute('disabled')
  } else if (input.value.length < 5) {
    submitButton.setAttribute('disabled', true)
  }
}
abilitateButton()

/* modal windows */

if(document.getElementById("btnModal")){
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("btnModal");
  var span = document.getElementsByClassName("close")[0];
  var body = document.getElementsByTagName("body")[0];

  btn.onclick = function() {
    modal.style.display = "block";

    body.style.position = "static";
    body.style.height = "100%";
    body.style.overflow = "hidden";
  }

  span.onclick = function() {
    modal.style.display = "none";

    body.style.position = "inherit";
    body.style.height = "auto";
    body.style.overflow = "visible";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";

      body.style.position = "inherit";
      body.style.height = "auto";
      body.style.overflow = "visible";
    }
  }
}


/*EVENTS */

submitButton.addEventListener('click', comprobateUserWord);
input.addEventListener('keyup', abilitateButton);
input.addEventListener('keyup', getUserWord);
