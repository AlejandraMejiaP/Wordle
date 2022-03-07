'use strict'

/* Constante y variables */

let secretWord = 'piano'
let input = document.querySelector('.input')
const submitButton = document.querySelector('.js-button')
let counter = 0
const grid = document.querySelector('.grid')
const gridColor = document.querySelectorAll('.grid__fill')
const gameOver = document.querySelector('.gameOver')
const congrats = document.querySelector(".congrats");
const firstRow = document.querySelectorAll('.firstRow__letter')
const secondRow = document.querySelectorAll('.secondRow__letter')
const thirdRow = document.querySelectorAll('.thirdRow__letter')
const fourthRow = document.querySelectorAll('.fourthRow__letter')
const fifthRow = document.querySelectorAll('.fifthRow__letter')
const sixthRow = document.querySelectorAll('.sixthRow__letter')
const GridSize = 6
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
let secretWordArray = secretWord.split('')

/* compare arrays */
function compareLetters() {
  let userWord = input.value
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
        restLetters[j] = ""
      }
    }
    
   }

    /* show in grid the user word */
    if (counter < GridSize) {
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
    } else {
      grid.classList.add('hidden')
      gameOver.classList.toggle('hidden')
      submitButton.setAttribute('disabled', true)
    }

    input.value = ''
    counter++
    if (rightLetters.length === secretWord.length){
        congrats.classList.toggle('hidden')
        submitButton.classList.add('hidden');
        input.classList.add('hidden')
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

/* Change colors fills */

/*EVENTS */

submitButton.addEventListener('click', compareLetters)
input.addEventListener('keyup', abilitateButton)
