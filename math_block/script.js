/*

 <div class="problem">
    <div class="operation">
        <div class="operand-1">8</div>
        <div class="operator">+</div>
        <div class="operand-2">3</div>
    </div>
    <div class="results">
        <div class="result">111</div>
        <div class="result">211</div>
        <div class="result">311</div>
        <div class="result">311</div>
    </div>
</div>

*/


function createProblem() {

    
    let operand1 = Math.floor(Math.random() * 10) + 1;
    let operand2 = Math.floor(Math.random() * 9) + 1;
    // Low probability of subtraction
    let operator = (Math.floor(Math.random() * 10) + 1) < 8 ? '+' : '-';
    // If subtraction, operand1 is biggest value to avoid negative result
    if(operator === '-' && operand2 > operand1) {
        [operand1, operand2] = [operand2, operand1];
    }

    let result;
    switch(operator) {
        case '+':
            result = operand1 + operand2;
            break;
        case '-':
            result = operand1 - operand2;
            break;
    }

    elOperand1.textContent = operand1;
    elOperator.textContent = operator;
    elOperand2.textContent = operand2;

    let possibleResults = elResults.length;
    const result_list = [];
    const result_pos = Math.floor(Math.random() * possibleResults); // This is the random position of the correct answer
    result_list.push(result);
    for(let i = 0; i < possibleResults; i++) {
        if(i === result_pos) {
            elResults[i].textContent = result;
            elResults[i].setAttribute('data-answer', 'true');
        } else {
            let result_generated = false;
            let result_incorrect;
            while(!result_generated) {
                // Generate an incorrecet result between 0 and (the correct result plus 6)
                result_incorrect = Math.floor(Math.random() * (result + 6));
                if(!result_list.includes(result_incorrect)) {
                    result_generated = true;
                }
            }
            result_list.push(result_incorrect);
            elResults[i].textContent = result_incorrect;
            elResults[i].setAttribute('data-answer', 'false');
        } 
    }

}

function checkAnswer() {

    console.log('checkAnswer');
    // this = result_div
    
    // If game is not in play, exit
    if(!gamePlay) return;

    // Determine which element to increment (right/wrong)
    let elScore;
    let elAudio;
    if(this.getAttribute('data-answer') === 'true') {
        elScore = elScoreRight;
        elAudio = audio_win;
    } else {
        elScore = elScoreWrong;
        elAudio = audio_error;
    }

    // Play appropriate audio file
    elAudio.currentTime = 0;
    elAudio.play();

    elScore.textContent = Number(elScore.textContent) + 1;
    elScore.classList.add(classGrow);

    // Create next problem
    createProblem();
    
}

function gameClick() {
    console.log('gameClick');
    if(btnGame.textContent === 'Start') {
        gameStart();
        btnGame.textContent = 'Reset';
    } else {
        gameReset();
        btnGame.textContent = 'Start';
    }
}


function gameReset() {
    console.log('gameReset');
    elTimer.textContent = gameTimer;
    elScoreWrong.textContent = '0';
    elScoreRight.textContent = '0';
    if(gameInterval) {
        gamePlay = false;
        clearInterval(gameInterval);
    }
}

function gameStart() {
    console.log('gameStart');
    gamePlay = true;
    let currentTimer = gameTimer;
    elTimer.textContent = currentTimer;
    createProblem();
    gameInterval = setInterval(()=> {
        currentTimer--;
        if(currentTimer === 0) {
            gamePlay = false;
            clearInterval(gameInterval);
            elTimer.classList.add(classGrow);
            // Check for new high score
            if(Number(elScoreRight.textContent) > Number(elScoreHigh.textContent)) {
                // Play audio
                audio_high_score.currentTime = 0;
                audio_high_score.play();
                // Update high score
                elScoreHigh.classList.add(classGrow);
                elScoreHigh.textContent = elScoreRight.textContent;                
            }


        }
        elTimer.textContent = currentTimer;
    }, 1000);

}

let btnGame = document.querySelector('#button-game');
let elTimer = document.querySelector('#timer');
let elScores = document.querySelectorAll('.score span');
let elScoreWrong = document.querySelector('#score-wrong');
let elScoreRight = document.querySelector('#score-right');
let elScoreHigh = document.querySelector('#score-high');
let elOperand1 = document.querySelector('.operand-1');
let elOperand2 = document.querySelector('.operand-2');
let elOperator = document.querySelector('.operator');
let elResults = document.querySelectorAll('.results .result');
let gameTimer = 60;
let gameInterval;
let gamePlay = false;
let classGrow = 'animate-grow';
let audio_win = document.querySelector('#audio_win');
let audio_error = document.querySelector('#audio_error');
let audio_high_score = document.querySelector('#audio_high_score');
elTimer.textContent = gameTimer;

btnGame.addEventListener('click', gameClick);
elResults.forEach(el => el.addEventListener('click', checkAnswer));
elScores.forEach(el => {
    el.addEventListener('transitionend', evt => {
        if(evt.propertyName !== 'transform') return;
        evt.target.classList.remove(classGrow);
    })
});

createProblem();
