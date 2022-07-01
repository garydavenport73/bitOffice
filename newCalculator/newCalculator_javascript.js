let calcInput = document.getElementById('calculator-input');

function buildCalcString(clickedButton) {
    calcInput.value += clickedButton.innerHTML;
}

function clearCalc() {
    calcInput.value = "";
}

function removeLastChar() {
    calcInput.value = calcInput.value.slice(0, -1);
}

function evaluateCalculatorInput() {
    document.getElementById('last-calculator-expression').innerHTML = calcInput.value;
    let result = '';
    try {
        result = eval(calcInput.value);
    } catch (error) {
        result = error;
    }
    calcInput.value = result;
}