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
    let results = 4;

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
    const result_id = Math.floor(Math.random() * results); // This is the random position of the correct answer
    result_list.push(result);
    for(let i = 0; i < results; i++) {
        if(i === result_id) {
            createChildElement('div', result, 'result', elResults).setAttribute('data-answer', true);
        } else {
            let result_found = false;
            let result_invalid;
            while(!result_found) {
                // Generate a bad result between 0 and (the correct result plus 6)
                result_invalid = Math.floor(Math.random() * (result + 6));
                if(!result_list.includes(result_invalid)) {
                    result_found = true;
                }
            }
            result_list.push(result_invalid);
            createChildElement('div', result_invalid, 'result', elResults)
        }   
    }

}

function createChildElement(elType, elText, elClass, elParent) {
    
    const el = document.createElement(elType);
    if(elText) {
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
