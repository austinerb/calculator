const container = document.querySelector("#container");
const display = document.querySelector("#display");
let displayContents = [0];
let currentIndex = 0; // index of display contents
let isDecimal = false;
let decimalLength = 0;

// add button even listeners
function addEventListeners() {
    const btns = container.querySelectorAll("button");

    // loop through the buttons
    btns.forEach(function(btn) {
        let id = btn.getAttribute("id");
        
        if (id == "0" || id == "1" || id == "2" || id == "3" || id == "4" ||
        id == "5" || id == "6" || id == "7" || id == "8" || id == "9") {
            btn.addEventListener("click", appendNumber);
        }

        if (id == "clear") {
            btn.addEventListener("click", clear);
        }

        if (id == "multiply" || id == "divide" || id == "add" || id == "subtract") {
            btn.addEventListener("click", appendOperator);
        }

        if (id == "period") {
            btn.addEventListener("click", appendDecimal);
        }

        if (id == "enter") {
            btn.addEventListener("click", enter);
        }
    });
}

// append number to the array
function appendNumber() {
    // check if current value is a number or operand
    // update if the value is an operand
    if (isNaN(displayContents[currentIndex])) {
        newValue();
    }

    let num = Number(this.textContent);

    if (!isDecimal) {
        // move the current number over one place and add the new number to the end
        displayContents[currentIndex] = displayContents[currentIndex] * 10 + num;
    } else {
        decimalLength++;
        let pow = (Math.pow(10, decimalLength));
        displayContents[currentIndex] = displayContents[currentIndex] * pow + num;
        displayContents[currentIndex] /= pow;
    }

    updateDisplay();
}

// clear all data
function clear() {
    currentIndex = 0;
    displayContents = [0];
    isDecimal = 0;
    decimalLength = 0;
    updateDisplay();
}

// append an operator
function appendOperator() {
    let operator = this.textContent;
    
    // add operand to the content array
    newValue();
    displayContents[currentIndex] = operator;

    updateDisplay();
}

function appendDecimal() {
    // check if current value is a number or operand
    // update if the value is an operand
    if (isNaN(displayContents[currentIndex])) {
        newValue();
    }

    isDecimal = true;
}

function enter() {
    while (displayContents.length > 1) {
        // seach for multiply instances
        let i = displayContents.indexOf("x");
        while (i != -1) {
            let result = multiply(displayContents[i-1], displayContents[i+1]);
            displayContents[i-1] = result;
            displayContents.splice(i, 2);
            currentIndex -= 2;

            i = displayContents.indexOf("x");
        }

        // seach for divide instances
        i = displayContents.indexOf("/");
        while (i != -1) {
            let result = divide(displayContents[i-1], displayContents[i+1]);
            displayContents[i-1] = result;
            displayContents.splice(i, 2);
            currentIndex -= 2;

            i = displayContents.indexOf("/");
        }

        // seach for add instances
        i = displayContents.indexOf("+");
        while (i != -1) {
            let result = add(displayContents[i-1], displayContents[i+1]);
            displayContents[i-1] = result;
            displayContents.splice(i, 2);
            currentIndex -= 2;

            i = displayContents.indexOf("+");
        }

        // seach for subtract instances
        i = displayContents.indexOf("-");
        while (i != -1) {
            let result = subtract(displayContents[i-1], displayContents[i+1]);
            displayContents[i-1] = result;
            displayContents.splice(i, 2);
            currentIndex -= 2;

            i = displayContents.indexOf("-");
        }
    }

    displayContents[0] = round(displayContents[0]);
    fixDecimal(displayContents[0]);
    updateDisplay();
}

function add(x,y) {
    return x + y;
}

function subtract(x,y) {
    return x - y;
}

function multiply(x,y) {
    return x * y;
}

function divide(x,y) {
    return x / y;
}

// round to the nearest 100th place
function round(num) {
    num *= 100;
    num = Math.round(num); 

    return num / 100;
}

// fix for decimal point length when calculating the answer
function fixDecimal(num) {
    num *= 100;

    let dec = num.toString();
    dec = dec.substring(dec.length - 2, dec.length);
    dec = Number(dec);

    if (dec == 0) {
        decimalLength = 0;
        isDecimal = false;
    } else if (dec % 10 == 0) {
        decimalLength = 1;
        isDecimal = true;
    } else {
        decimalLength = 2;
        isDecimal = true;
    }
}

// called each time a new type of button is pushed
function newValue() {
    isDecimal = false;
    decimalLength = 0;
    currentIndex++;
    displayContents[currentIndex] = 0;
}

// called when backspace is called on last value of an index of the array
function removeValue() {
    if (currentIndex == 0) return;

    displayContents.pop();
    currentIndex--;
}

function updateDisplay() {
    let str = "";

    // loop through all the contents and make a string out of them
    for (let i = 0; i < displayContents.length; i++) {
        str = str + " " + displayContents[i];
    }

    display.textContent = str;
}

addEventListeners();