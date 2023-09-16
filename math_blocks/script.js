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

    const elProblems = document.querySelector('.problems');
    let possibleResults = 4;

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

    const elProblem = createChildElement('div', null, 'problem', elProblems);
    const elOperation = createChildElement('div', null, 'operation', elProblem);
    const elResults = createChildElement('div', null, 'results', elProblem);
    createChildElement('div', operand1, 'operand-1', elOperation);
    createChildElement('div', operator, 'operator', elOperation);
    createChildElement('div', operand2, 'operand-2', elOperation);

    const result_list = [];
    const result_pos = Math.floor(Math.random() * possibleResults); // This is the random position of the correct answer
    result_list.push(result);
    for(let i = 0; i < possibleResults; i++) {
        let result_div;
        if(i === result_pos) {
            result_div = createChildElement('div', result, 'result', elResults)
            result_div.setAttribute('data-answer', 'true');
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
            result_div = createChildElement('div', result_incorrect, 'result', elResults)
        } 
        result_div.addEventListener('click', checkAnswer);
    }

}

function checkAnswer() {
    // this = result_div
    this.classList.add('clicked');
    this.addEventListener('transitionend', evt => {
        if(evt.propertyName !== 'transform') return;
        evt.target.classList.remove('clicked');
    })



    const div_problem = this.closest('.problem');
    const div_results = this.closest('.results').querySelectorAll('.result'); // Go up to the parent (.results), then select all children (.result)
    // Remove click event from each/all results
    div_results.forEach(div => {
        div.removeEventListener('click', checkAnswer)
        div.classList.add('answered');
    });
    // Apply appropriate class
    this.classList.add('selected');
    if(this.getAttribute('data-answer') === 'true') {
        div_problem.classList.add('correct');
    } else {
        div_problem.classList.add('incorrect');
    }
    
}

function createChildElement(elType, elText, elClass, elParent) {
    
    
    const el = document.createElement(elType);
    // Specifying null here because elText===0 evaluates to false (but thats the text/result)
    if(elText != null) {
        el.textContent = elText;
    }
    if(elClass) {
        el.classList.add(elClass);
    }
    if(elParent) {
        elParent.appendChild(el);
    }
    return el;
}

for(let i = 0; i < 8; i++) {
    createProblem();
}
