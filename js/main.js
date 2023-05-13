import * as consts from './modules/consts.js'
import {Word} from './modules/word.js'
import {Letter} from './modules/letter.js'

let feedback = document.querySelector('.input-feedback.js-feedback');
feedback.style.display = 'none';
let gameResult = document.querySelector('.result.js-game-result');
gameResult.style.display = 'none';
let lives = document.querySelector('.js-lives');
lives.textContent = consts.MAX_ATTEMPTS;
let input = document.getElementById('letter');
let randomWord = new Word (getRandomWord());
randomWord.word = randomWord.word.split('');
console.log(randomWord.word); // SPLIT WORD FOR REVIEW
let inputLetter = new Letter (input.value);
let button = document.querySelector('.btn.js-try');

addPs(randomWord.word);

//This function uses floor and random Math methods to choose a random word from our verb list
function getRandomWord(){
    let randomIndex = Math.floor(Math.random() * consts.VERB_LIST.length);
    let randomWord = consts.VERB_LIST[randomIndex];
    return randomWord;
};
// This function creates a fragment of p elements with each letter of our random word
// and adds it to our board. The container for this fragment is our main element
function addPs(randomWord){
    let fragment = document.createDocumentFragment();
    let pElements = [];
    let textNodes = [];

    for(let i = 0; i < randomWord.length; i++){
        pElements[i] = document.createElement('p');
        pElements[i].classList.add('board-letter', 'js-letter')
        textNodes[i] = document.createTextNode('-');
        pElements[i].appendChild(textNodes[i]);
        fragment.appendChild(pElements[i]);
    }
    let boardContainer = document.querySelector('.board-word.js-word');
    boardContainer.appendChild(fragment);
}

function compareAndAdd(randomWord, inputLetter){
    let pElements = document.querySelectorAll('.board-letter.js-letter');
    let spanFail = document.querySelector('.js-fails');
    let spanSuccess = document.querySelector('.js-success');
    let foundMatch = false;

    for (let i = 0; i < randomWord.length; i++){
        if (inputLetter === randomWord[i]){
            pElements[i].textContent = randomWord[i].toUpperCase();
            foundMatch = true;
        }
    }
    if (foundMatch && /^[a-z-]/i.test(inputLetter)){
        inputLetter = inputLetter.toUpperCase();
        if (spanSuccess.textContent === ''){
            let textNode = document.createTextNode(inputLetter);
            spanSuccess.appendChild(textNode);
        } else if (spanSuccess.textContent !== ''){
            if (spanSuccess.textContent.includes(inputLetter)){
                feedback.style.display = '';
            } else{
            let comma = document.createTextNode(', ')
            let textNode = document.createTextNode(inputLetter);
            spanSuccess.appendChild(comma);
            spanSuccess.appendChild(textNode);
            }
        }
    }

    if (!foundMatch && /^[a-z-]/i.test(inputLetter)){
        inputLetter = inputLetter.toUpperCase();
        if (spanFail.textContent === ''){
            let textNode = document.createTextNode(inputLetter);
            spanFail.appendChild(textNode);
            lives.textContent--;
        } else if (spanFail.textContent !== ''){
            if (spanFail.textContent.includes(inputLetter)){
                feedback.style.display = '';
            } else{
                let comma = document.createTextNode(', ')
                let textNode = document.createTextNode(inputLetter);
                spanFail.appendChild(comma);
                spanFail.appendChild(textNode);
                lives.textContent--;

            }
        }
    }

    if (!/^[a-z-]/i.test(inputLetter)){
        feedback.style.display = '';
    }

    if (lives.textContent === '0'){
        gameResult.classList.add('result--ko');
        randomWord = randomWord.join('');
        randomWord = randomWord.toUpperCase();
        let gameOver = document.createTextNode('\u{1F480} Game Over! The secret word was: ' + randomWord);
        gameResult.appendChild(gameOver);
        gameResult.style.display = '';
      }

    checkIfWin(pElements, randomWord);

}

// This function adds an Event Listener to our button "try!"
// The first step is to deactivate the feedback message, in case it was activated before
// Then we use focus() so the user can insert the next letter without having to click in the input box
// Now we use the object we have created: inputLetter to save any letter the user inputs
// We transform this letter to a lowercase in order to compare it later on
// Next we clear the value inside input so it's ready for the next letter
button.addEventListener('click', function(){
    feedback.style.display = 'none';
    input.focus();
    inputLetter.letter = input.value;
    inputLetter.letter = inputLetter.letter.toLowerCase();
    console.log(inputLetter.letter);
    input.value = '';
    compareAndAdd(randomWord.word, inputLetter.letter);
});

function checkIfWin(pElements, randomWord){
    let count = 0;
    for (let i = 0; i < randomWord.length; i++){
        let lCaseLetters = [];
        lCaseLetters[i] = pElements[i].textContent.toLowerCase(); 
        if (lCaseLetters[i] === randomWord[i]){
            count++;
        }
    }
    if (count === randomWord.length){
        gameResult.classList.add('result--ok');
        randomWord = randomWord.join('');
        randomWord = randomWord.toUpperCase();
        let gameWon = document.createTextNode('\u{1F389} Congratulations!');
        gameResult.appendChild(gameWon);
        gameResult.style.display = '';
    }

}


